import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { ProposalReport } from '../model/proposal/report/proposal-report';
import { ProposalWithReport } from '../model/proposal/proposal-with-report';

export interface IDbProposalRepository {
    saveProposal(ipfsProposal: IpfsProposal, ipfsHash: string): Promise<void>;
    findProposalsIpfsHashes(daoIpfsHash: string, offset: number, limit: number, titleFilter?: string): Promise<string[]>;
    findProposalWithReportByIpfsHash(ipfsHash: string): Promise<ProposalWithReport | undefined>;
    saveProposalReport(proposalReport: ProposalReport): Promise<void>;
    countProposals(daoIpfsHash: string): Promise<number>;
}