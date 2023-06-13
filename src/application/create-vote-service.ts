import { IIpfsRepository } from '../domain/repository/i-ipfs-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { IDbSequencerRepository } from '../domain/repository/i-db-sequencer-repository';
import { IMapperService } from '../domain/service/i-mapper-service';
import { SignatureService } from '../domain/service/signature-service';
import { CreateVoteDto } from '../interfaces/dto/create-vote-dto';
import { IDbVoteRepository } from '../domain/repository/i-db-vote-repository';
import { LOGGER } from '../infrastructure/pino-logger-service';
import { IDbUserRepository } from '../domain/repository/i-db-user-repository';
import { isExpired } from './date-service';

export class CreateVoteService {
    private readonly ipfsRepository: IIpfsRepository;
    private readonly dbVoteRepository: IDbVoteRepository;
    private readonly dbUserRepository:  IDbUserRepository;
    private readonly mapperService: IMapperService;
    private readonly signatureService: SignatureService;
    private readonly dbProposalRepository: IDbProposalRepository;

    constructor({ipfsRepository, dbVoteRepository, mapperService, signatureService, dbUserRepository, dbProposalRepository}:
                    {
                        ipfsRepository: IIpfsRepository,
                        dbVoteRepository: IDbVoteRepository,
                        mapperService: IMapperService,
                        signatureService: SignatureService,
                        dbUserRepository: IDbUserRepository,
                        dbProposalRepository: IDbProposalRepository,
                    }) {
        this.ipfsRepository = ipfsRepository;
        this.dbVoteRepository = dbVoteRepository;
        this.mapperService = mapperService;
        this.signatureService = signatureService;
        this.dbUserRepository = dbUserRepository;
        this.dbProposalRepository = dbProposalRepository;
    }

    async createVote(createVoteDto: CreateVoteDto): Promise<string> {
        const signatureValid = this.signatureService.isVoteValid(createVoteDto.getClientVote(), createVoteDto.getUserSignature());
        if (signatureValid) {
            const proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(createVoteDto.getClientVote().getProposalIpfsHash());
            if (proposalWithReport !== undefined) {
                if (!isExpired(proposalWithReport.proposal.getIpfsProposal().clientProposal.endDateUtc)) {
                    const ipfsVote = this.mapperService.toIpfsVote(createVoteDto);
                    await this.dbUserRepository.findOrCreateUser(createVoteDto.getClientVote().getVoterAddress());
                    const ipfsHash = await this.ipfsRepository.saveVote(ipfsVote);
                    LOGGER.info(`Vote of ${createVoteDto.getClientVote().getVoterAddress()} saved to IPFS: ${ipfsHash})`);
                    await this.dbVoteRepository.saveVote(ipfsVote, ipfsHash, proposalWithReport.proposal.getIpfsHash());
                    LOGGER.info(`Proposal vote saved ${ipfsHash} to db`);
                    return ipfsHash;
                } else {
                    throw new Error(`Creating vote failed. Proposal with ipfsHash ${createVoteDto.getClientVote().getProposalIpfsHash()} is ended!`);
                }
            } else {
                throw new Error(`Creating vote failed. Proposal with ipfsHash ${createVoteDto.getClientVote().getProposalIpfsHash()} is not found!`);
            }
        } else {
            throw new Error(`Creating vote failed. Vote client signature is not valid.`);
        }

    }
}