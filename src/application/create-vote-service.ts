import { IIpfsRepository } from '../domain/repository/i-ipfs-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { IMapperService } from '../domain/service/i-mapper-service';
import { SignatureService } from '../domain/service/signature-service';
import { CreateVoteDto } from '../interfaces/dto/create-vote-dto';
import { IDbVoteRepository } from '../domain/repository/i-db-vote-repository';
import { LOGGER } from '../infrastructure/pino-logger-service';
import { IDbUserRepository } from '../domain/repository/i-db-user-repository';
import { isDateCreatedInLastGivenMinutes, isExpired } from './date-service';
import { TokenDataService } from './dao/token-data-service';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { Dao } from '../domain/model/dao/dao';
import { WrongVotingPowerError } from './error/wrong-voting-power-error';

export class CreateVoteService {
    private readonly ipfsRepository: IIpfsRepository;
    private readonly dbVoteRepository: IDbVoteRepository;
    private readonly dbUserRepository:  IDbUserRepository;
    private readonly mapperService: IMapperService;
    private readonly signatureService: SignatureService;
    private readonly dbProposalRepository: IDbProposalRepository;
    private readonly tokenDataService: TokenDataService;
    private readonly dbDaoRepository: IDbDaoRepository;

    constructor({ipfsRepository, dbVoteRepository, mapperService, signatureService, dbUserRepository, dbProposalRepository, tokenDataService, dbDaoRepository}:
                    {
                        ipfsRepository: IIpfsRepository,
                        dbVoteRepository: IDbVoteRepository,
                        mapperService: IMapperService,
                        signatureService: SignatureService,
                        dbUserRepository: IDbUserRepository,
                        dbProposalRepository: IDbProposalRepository,
                        tokenDataService: TokenDataService,
                        dbDaoRepository: IDbDaoRepository,
                    }) {
        this.ipfsRepository = ipfsRepository;
        this.dbVoteRepository = dbVoteRepository;
        this.mapperService = mapperService;
        this.signatureService = signatureService;
        this.dbUserRepository = dbUserRepository;
        this.dbProposalRepository = dbProposalRepository;
        this.tokenDataService = tokenDataService;
        this.dbDaoRepository = dbDaoRepository;
    }

    async createVote(createVoteDto: CreateVoteDto): Promise<string> {
        const signatureValid = this.signatureService.isVoteValid(createVoteDto.clientVote, createVoteDto.userSignature);
        if (signatureValid) {
            const proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(createVoteDto.clientVote.proposalIpfsHash);
            if (proposalWithReport !== undefined) {
                if (!isExpired(proposalWithReport.proposal.ipfsProposal.clientProposal.endDateUtc)) {
                    // dao will always exist
                    const dao: Dao | undefined = await this.dbDaoRepository.findDao(proposalWithReport.proposal.ipfsProposal.clientProposal.daoIpfsHash);
                    const userTokenBalanceAtProposalBlock = await this.tokenDataService.getBalanceOfAddressAtBlock(
                        dao!.ipfsDao.clientDao.token.address,
                        Number(dao!.ipfsDao.clientDao.token.decimals),
                        createVoteDto.clientVote.voterAddress,
                        // read account balance at address
                        Number(proposalWithReport.proposal.ipfsProposal.clientProposal.blockNumber),
                        dao!.ipfsDao.clientDao.token.chainId);
                    if ((userTokenBalanceAtProposalBlock === createVoteDto.clientVote.votingPower)) {
                        if (isDateCreatedInLastGivenMinutes(createVoteDto.clientVote.voteDate, 2)) {
                            const ipfsVote = this.mapperService.toIpfsVote(createVoteDto);
                            await this.dbUserRepository.findOrCreateUser(createVoteDto.clientVote.voterAddress);
                            const ipfsHash = await this.ipfsRepository.saveVote(ipfsVote);
                            LOGGER.info(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: vote of ${createVoteDto.clientVote.voterAddress} saved to IPFS: ${ipfsHash})`);
                            await this.dbVoteRepository.saveVote(ipfsVote, ipfsHash, proposalWithReport.proposal.ipfsHash);
                            LOGGER.info(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: vote saved ${ipfsHash} to db`);
                            return ipfsHash;
                        } else {
                            throw new Error(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: creating vote failed. Vote date ${createVoteDto.clientVote.voteDate} is not in last 2 minutes!`);
                        }
                    } else {
                        if (Number(userTokenBalanceAtProposalBlock) > 0) {
                            LOGGER.info(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: client given voting power is ${createVoteDto.clientVote.votingPower} but read at proposal block ${proposalWithReport.proposal.ipfsProposal.clientProposal.blockNumber} is ${userTokenBalanceAtProposalBlock}. Returning this value to client.`);
                            throw new WrongVotingPowerError(userTokenBalanceAtProposalBlock,  proposalWithReport.proposal.ipfsProposal.clientProposal.blockNumber);
                        } else {
                            throw new Error(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: creating vote failed. Client received voting power at proposal block ${proposalWithReport.proposal.ipfsProposal.clientProposal.blockNumber} is ${createVoteDto.clientVote.votingPower} but read voting power is 0`);
                        }
                    }
                } else {
                    throw new Error(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: creating vote failed. Proposal with ipfsHash ${createVoteDto.clientVote.proposalIpfsHash} is ended!`);
                }
            } else {
                throw new Error(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: creating vote failed. Proposal with ipfsHash ${createVoteDto.clientVote.proposalIpfsHash} is not found!`);
            }
        } else {
            throw new Error(`Proposal ${createVoteDto.clientVote.proposalIpfsHash}: creating vote failed. Vote client signature is not valid.`);
        }
    }
}