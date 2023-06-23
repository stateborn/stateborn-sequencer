import { CreateProposalDto } from '../interfaces/dto/create-proposal-dto';
import { IMapperService } from '../domain/service/i-mapper-service';
import { IIpfsRepository } from '../domain/repository/i-ipfs-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { SignatureService } from '../domain/service/signature-service';
import { IDbSequencerRepository } from '../domain/repository/i-db-sequencer-repository';
import { LOGGER } from '../infrastructure/pino-logger-service';
import { TokenDataService } from './dao/token-data-service';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { Dao } from '../domain/model/dao/dao';
import { isDateCreatedInLast5minutes, isDateInTheFuture, isUtcDateAAfterB } from './date-service';
import { ProposalType } from '../domain/model/proposal/proposal-type';
import { DaoTokenType } from '../domain/model/dao/dao-token-type';

export class CreateProposalService {

    private readonly ipfsRepository: IIpfsRepository;
    private readonly dbProposalRepository: IDbProposalRepository;
    private readonly dbDaoRepository: IDbDaoRepository;
    private readonly dbSequencerRepository: IDbSequencerRepository;
    private readonly mapperService: IMapperService;
    private readonly signatureService: SignatureService;
    private readonly tokenDataService: TokenDataService;

    constructor({
                    ipfsRepository,
                    dbProposalRepository,
                    dbSequencerRepository,
                    mapperService,
                    signatureService,
                    tokenDataService,
                    dbDaoRepository
                }:
                    {
                        ipfsRepository: IIpfsRepository,
                        dbProposalRepository: IDbProposalRepository,
                        dbSequencerRepository: IDbSequencerRepository,
                        mapperService: IMapperService,
                        signatureService: SignatureService,
                        dbDaoRepository: IDbDaoRepository,
                        tokenDataService: TokenDataService
                    }) {
        this.ipfsRepository = ipfsRepository;
        this.dbProposalRepository = dbProposalRepository;
        this.dbSequencerRepository = dbSequencerRepository;
        this.mapperService = mapperService;
        this.signatureService = signatureService;
        this.tokenDataService = tokenDataService;
        this.dbDaoRepository = dbDaoRepository;
    }

    public async createProposal(createProposalDto: CreateProposalDto): Promise<void> {
        const signatureValid = this.signatureService.isProposalValid(createProposalDto.clientProposal, createProposalDto.creatorSignature);
        if (signatureValid) {
            const dao: Dao | undefined = await this.dbDaoRepository.findDao(createProposalDto.clientProposal.daoIpfsHash);
            if (dao !== undefined) {
                let userTokenBalanceAtProposalBlock;
                if (dao.ipfsDao.clientDao.token.type === DaoTokenType.ERC20) {
                    userTokenBalanceAtProposalBlock = await this.tokenDataService.getBalanceOfAddressAtBlock(
                        dao.ipfsDao.clientDao.token.address, Number(dao.ipfsDao.clientDao.token.decimals), createProposalDto.clientProposal.creatorAddress,
                        Number(createProposalDto.clientProposal.blockNumber), dao.ipfsDao.clientDao.token.chainId);
                } else {
                    // TODO for nft
                    userTokenBalanceAtProposalBlock = '1';
                }
                if (Number(userTokenBalanceAtProposalBlock) >= Number(dao.ipfsDao.clientDao.proposalTokenRequiredQuantity)) {
                    if (this.areProposalDatesCorrect(createProposalDto)) {
                        if (createProposalDto.clientProposal.proposalType === ProposalType.OPTIONS) {
                            const proposalOptions = (<any>createProposalDto.clientProposal.data)?.options;
                            if (!this.proposalOptionsAreCorrect(proposalOptions)) {
                                throw new Error(`Creating proposal failed. Proposal options are not correct: ${(<any>createProposalDto.clientProposal.data)?.options}`);
                            }
                        }
                        if (createProposalDto.clientProposal.proposalType === ProposalType.YES_NO) {
                            if (createProposalDto.clientProposal.data !== undefined) {
                                throw new Error(`Creating proposal failed. For proposal type ${createProposalDto.clientProposal.proposalType} data must be undefined!`);
                            }
                        }
                        const latestTokenBlock = await this.tokenDataService.getBlockNumber(dao.ipfsDao.clientDao.token.chainId);
                        if (latestTokenBlock >= Number(createProposalDto.clientProposal.blockNumber)) {
                            const ipfsProposal = this.mapperService.toIpfsProposal(createProposalDto);
                            await this.dbSequencerRepository.findOrCreateSequencer(createProposalDto.clientProposal.creatorAddress);
                            const ipfsHash = await this.ipfsRepository.saveProposal(ipfsProposal);
                            LOGGER.info(`Proposal saved to IPFS: ${ipfsHash})`);
                            await this.dbProposalRepository.saveProposal(ipfsProposal, ipfsHash);
                            LOGGER.info(`Proposal saved ${ipfsHash} to db`);
                        } else {
                            throw new Error(`Creating proposal failed. Proposal block number is incorrect. Given ${createProposalDto.clientProposal.blockNumber} but
                            latest read block number is ${latestTokenBlock}!`);
                        }
                    } else {
                        throw new Error(`Creating proposal failed. Proposal dates are not correct. Start date: ${createProposalDto.clientProposal.startDateUtc} 
                            End date: ${createProposalDto.clientProposal.endDateUtc}`);
                    }
                } else {
                    throw new Error(`Creating proposal failed. Proposal required tokens to have is ${dao.ipfsDao.clientDao.proposalTokenRequiredQuantity}
                     but at block ${createProposalDto.clientProposal.blockNumber} user ${createProposalDto.clientProposal.creatorAddress} has ${userTokenBalanceAtProposalBlock}!`);
                }
            } else {
                throw new Error(`Creating proposal failed. DAO with ipfs hash ${createProposalDto.clientProposal.daoIpfsHash} not found!`);
            }
        } else {
            throw new Error(`Creating proposal failed. Proposal client signature is not valid.`);
        }
    }

    // proposalOptions is the array of string
    // string cannot be longer than 120 words
    private proposalOptionsAreCorrect(proposalOptions: any | undefined): boolean {
        return proposalOptions !== undefined && proposalOptions !== null && Array.isArray(proposalOptions) && proposalOptions.length > 0
        && proposalOptions.filter(_ => typeof _ === 'string' && _.length <= 120).length === proposalOptions.length;
    }

    private areProposalDatesCorrect(proposal: CreateProposalDto): boolean {
        const proposalStartDateCorrect = isDateCreatedInLast5minutes(proposal.clientProposal.startDateUtc);
        const proposalEndDateInFuture = isDateInTheFuture(proposal.clientProposal.endDateUtc);
        const areDatesCorrect = isUtcDateAAfterB(proposal.clientProposal.endDateUtc, proposal.clientProposal.startDateUtc);
        return proposalStartDateCorrect && proposalEndDateInFuture && areDatesCorrect;
    }
}