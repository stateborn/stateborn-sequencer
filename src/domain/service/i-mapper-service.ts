import { CreateProposalDto } from '../../interfaces/dto/create-proposal-dto';
import { ProposalDto } from '../../interfaces/dto/proposal-dto';
import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { Proposal } from '../model/proposal/proposal';
import { CreateVoteDto } from '../../interfaces/dto/create-vote-dto';
import { IpfsVote } from '../model/vote/ipfs-vote';
import { VoteDto } from '../../interfaces/dto/vote-dto';
import { Vote } from '../model/vote/vote';

export interface IMapperService {
    toIpfsProposal(createProposalDto: CreateProposalDto): IpfsProposal;
    toProposalDto(proposal: Proposal): ProposalDto;
    toIpfsVote(createVoteDto: CreateVoteDto): IpfsVote;
    toVoteDto(vote: Vote): VoteDto;
}