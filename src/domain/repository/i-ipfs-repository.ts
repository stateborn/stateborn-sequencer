import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { IpfsVote } from '../model/vote/ipfs-vote';
import { IpfsProposalReport } from '../model/proposal/report/ipfs-proposal-report';
import { IpfsDao } from '../model/dao/ipfs-dao';

export interface IIpfsRepository {
    saveProposal(ipfsProposal: IpfsProposal): Promise<string>;
    saveVote(ipfsVote: IpfsVote): Promise<string>;
    saveProposalReport(ipfsProposalReport: IpfsProposalReport): Promise<string>;
    saveDao(ipfsDao: IpfsDao): Promise<string>;
}