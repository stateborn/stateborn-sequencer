import { DaoTransactionService } from './dao/dao-transaction-service';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { BlockchainProposalStatus } from '../domain/model/proposal/blockchain-proposal-status';
import { LOGGER } from '../infrastructure/pino-logger-service';
import { ProposalType } from '../domain/model/proposal/proposal-type';
import { BlockchainProposalChainTransactionStatus } from '../domain/model/proposal/blockchain-proposal-chain-transaction-status';

export class ProposalTransactionService {

    private daoTransactionService: DaoTransactionService;
    private readonly dbProposalRepository: IDbProposalRepository;
    private readonly dbDaoRepository: IDbDaoRepository;

    constructor({daoTransactionService, dbProposalRepository, dbDaoRepository}: {
        daoTransactionService: DaoTransactionService
        dbProposalRepository: IDbProposalRepository
        dbDaoRepository: IDbDaoRepository
    }) {
        this.daoTransactionService = daoTransactionService;
        this.dbProposalRepository = dbProposalRepository;
        this.dbDaoRepository = dbDaoRepository;
    }

    public async createProposalTransactions(proposalIpfsHash: string): Promise<void> {
        const proposal = await this.dbProposalRepository.findProposalWithReportAndBlockchainProposal(proposalIpfsHash);
        if (proposal) {
            if (proposal.proposal.ipfsProposal.clientProposal.proposalType === ProposalType.YES_NO) {
                if (proposal.proposalReport) {
                    if (proposal.proposalReport.ipfsProposalReport.proposalResult === 'YES') {
                        if (proposal.blockchainProposal) {
                            const dao = await this.dbDaoRepository.findDao(proposal.proposal.ipfsProposal.clientProposal.daoIpfsHash);
                            try {
                                const res = await this.daoTransactionService.createProposal(proposal.proposal, dao!.ipfsDao.clientDao, proposal.proposalReport);
                                const proposalAddress = res[0];
                                const txHash = res[1];
                                LOGGER.info(`Proposal ${proposal.proposal.ipfsHash} created on-chain successfully. Address: ${proposalAddress}, tx hash: ${txHash}`);
                                await this.dbProposalRepository.updateBlockchainProposal(proposal.proposal.ipfsHash, proposalAddress, dao?.ipfsDao.clientDao.token.chainId!, BlockchainProposalStatus.CREATED_ON_CHAIN);
                                await this.dbProposalRepository.createProposalBlockchainChainTransaction(proposal.proposal.ipfsHash, txHash, BlockchainProposalChainTransactionStatus.PROPOSAL_TRANSACTIONS_CREATED);
                                LOGGER.info(`Proposal ${proposal.proposal.ipfsHash} transactions updated in db to ${BlockchainProposalStatus.CREATED_ON_CHAIN}`);
                            } catch (err) {
                                throw new Error(`Create on-chain proposal transactions failed. Transaction error: ${err}`);
                            }
                        } else {
                            LOGGER.info(`Skip proposal ${proposal.proposal.ipfsHash} on-chain transaction creation checking. Proposal didn't have any transactions to execute.`);
                        }
                    } else {
                        LOGGER.info(`Skip proposal ${proposal.proposal.ipfsHash} on-chain transaction creating checking. Proposal didn't pass (ended with NO decision)`);
                    }
                } else {
                    throw new Error(`Create on-chain proposal transactions failed. Proposal report for proposal ${proposalIpfsHash} is not yet generated, proposal is probably active!`)
                }
            } else {
                LOGGER.info(`Skip proposal ${proposal.proposal.ipfsHash} on-chain transaction creation checking. Proposal is not YES/NO type`);
            }
        } else {
            throw new Error(`Create on-chain proposal transactions failed. Proposal with ipfsHash ${proposalIpfsHash} is not found!`);
        }
    }

    public async executeProposalTransactions(proposalIpfsHash: string): Promise<void> {
        const proposal = await this.dbProposalRepository.findProposalWithReportAndBlockchainProposal(proposalIpfsHash);
        const dao = await this.dbDaoRepository.findDao(proposal!.proposal.ipfsProposal.clientProposal.daoIpfsHash);
        const proposalTxId = await this.daoTransactionService.executeProposalTransactions(proposal!.proposal, dao!.ipfsDao.clientDao, proposal!.proposalReport!);
    }

}