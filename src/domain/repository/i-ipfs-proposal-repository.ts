import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { IpfsVote } from '../model/vote/ipfs-vote';

export interface IIpfsProposalRepository {
    saveProposal(ipfsProposal: IpfsProposal): Promise<string>;
    saveVote(ipfsVote: IpfsVote): Promise<string>;
}