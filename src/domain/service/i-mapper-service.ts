import { CreateProposalDto } from '../../interfaces/dto/create-proposal-dto';
import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { CreateVoteDto } from '../../interfaces/dto/create-vote-dto';
import { IpfsVote } from '../model/vote/ipfs-vote';
import { VoteDto } from '../../interfaces/dto/vote-dto';
import { Vote } from '../model/vote/vote';
import { ProposalWithReport } from '../model/proposal/proposal-with-report';
import { ProposalWithReportDto } from '../../interfaces/dto/proposal-with-report-dto';
import { Proposal } from '../model/proposal/proposal';
import { ProposalDto } from '../../interfaces/dto/proposal-dto';
import { Dao } from '../model/dao/dao';
import { DaoDto } from '../../interfaces/dto/dao/dao-dto';

export interface IMapperService {
    toIpfsProposal(createProposalDto: CreateProposalDto): IpfsProposal;
    toProposalWithReportDto(proposalWithReport: ProposalWithReport): ProposalWithReportDto;
    toProposalDto(proposal: Proposal): ProposalDto;
    toDaoDto(dao: Dao): DaoDto;
    toIpfsVote(createVoteDto: CreateVoteDto): IpfsVote;
    toVoteDto(vote: Vote): VoteDto;
}