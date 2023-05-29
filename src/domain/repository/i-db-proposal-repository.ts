import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { Proposal } from '../model/proposal/proposal';

export interface IDbProposalRepository {
    saveProposal(ipfsProposal: IpfsProposal, ipfsHash: string): Promise<void>;
    findProposals(offset?: number, limit?: number): Promise<Proposal[]>;
    findProposalByIpfsHash(ipfsHash: string): Promise<Proposal | undefined>;
}