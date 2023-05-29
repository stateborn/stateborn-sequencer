import { IpfsVote } from '../model/vote/ipfs-vote';
import { Vote } from '../model/vote/vote';

export interface IDbVoteRepository {
    saveVote(ipfsVote: IpfsVote, ipfsHash: string, proposalId: string): Promise<void>;
    findVotes(proposalIpfsHash: string, offset?: number, limit?: number): Promise<Vote[]>;
    findUserAddressVotes(proposalIpfsHash: string, userAddress: string): Promise<Vote[]>;
}