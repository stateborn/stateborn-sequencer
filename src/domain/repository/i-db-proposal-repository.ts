import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { Proposal } from '../model/proposal/proposal';
import { ProposalReport } from '../model/proposal/report/proposal-report';
import { ProposalWithReport } from '../model/proposal/proposal-with-report';

export interface IDbProposalRepository {
    saveProposal(ipfsProposal: IpfsProposal, ipfsHash: string): Promise<void>;
    findProposals(daoIpfsHash: string, offset?: number, limit?: number): Promise<Proposal[]>;
    findProposalWithReportByIpfsHash(ipfsHash: string): Promise<ProposalWithReport | undefined>;
    saveProposalReport(proposalReport: ProposalReport): Promise<void>;
}