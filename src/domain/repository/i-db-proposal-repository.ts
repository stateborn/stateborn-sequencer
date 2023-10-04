import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { ProposalReport } from '../model/proposal/report/proposal-report';
import { ProposalWithReport } from '../model/proposal/proposal-with-report';
import {
    ProposalWithReportAndBlockchainProposal
} from '../model/proposal/proposal-with-report-and-blockchain-proposal';
import { BlockchainProposalStatus } from '../model/proposal/blockchain-proposal-status';
import {
    BlockchainProposalChainTransactionStatus
} from '../model/proposal/blockchain-proposal-chain-transaction-status';
import { BlockchainProposal } from '../model/proposal/proposal-transaction/blockchain-proposal';

export interface IDbProposalRepository {
    saveProposal(ipfsProposal: IpfsProposal, ipfsHash: string, chainId?: string): Promise<void>;

    findProposalsIpfsHashes(daoIpfsHash: string, offset: number, limit: number, titleFilter?: string): Promise<string[]>;

    findBlockchainProposal(proposalIpfsHash: string): Promise<BlockchainProposal | undefined>;

    //todo remove probably
    // updateProposalTransactions(proposalIpfsHash: string, transactionStatus: BlockchainProposalStatus, txHash: string): Promise<void>;
    updateBlockchainProposal(proposalIpfsHash: string, address: string, chainId: string, blockchainProposalStatus: BlockchainProposalStatus): Promise<void>;

    createProposalBlockchainChainTransaction(proposalIpfsHash: string, txHash: string, transactionStatus: BlockchainProposalChainTransactionStatus): Promise<void>;

    findProposalWithReportByIpfsHash(ipfsHash: string): Promise<ProposalWithReport | undefined>;

    findProposalWithReportAndBlockchainProposal(ipfsHash: string): Promise<ProposalWithReportAndBlockchainProposal | undefined>;

    saveProposalReport(proposalReport: ProposalReport): Promise<void>;

    countProposals(daoIpfsHash: string): Promise<number>;
}