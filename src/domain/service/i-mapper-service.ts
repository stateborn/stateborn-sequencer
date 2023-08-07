import { CreateProposalDto } from '../../interfaces/dto/create-proposal-dto';
import { IpfsProposal } from '../model/proposal/ipfs-proposal';
import { CreateVoteDto } from '../../interfaces/dto/create-vote-dto';
import { IpfsVote } from '../model/vote/ipfs-vote';
import { VoteDto } from '../../interfaces/dto/vote-dto';
import { Vote } from '../model/vote/vote';
import { Proposal } from '../model/proposal/proposal';
import { ProposalDto } from '../../interfaces/dto/proposal-dto';
import { Dao } from '../model/dao/dao';
import { DaoDto } from '../../interfaces/dto/dao/dao-dto';
import { ProposalReport } from '../model/proposal/report/proposal-report';
import { ProposalReportDto } from '../../interfaces/dto/report/proposal-report-dto';
import { BlockchainProposal } from '../model/proposal/proposal-transaction/blockchain-proposal';
import { BlockchainProposalDto } from '../../interfaces/dto/proposal/blockchain-proposal-dto';

export interface IMapperService {
    toIpfsProposal(createProposalDto: CreateProposalDto): IpfsProposal;
    toProposalReportDto(proposalReport: ProposalReport): ProposalReportDto;
    toProposalDto(proposal: Proposal): ProposalDto;
    toDaoDto(dao: Dao): DaoDto;
    toIpfsVote(createVoteDto: CreateVoteDto): IpfsVote;
    toVoteDto(vote: Vote): VoteDto;
    toBlockchainProposalDto(blockchainProposal: BlockchainProposal): BlockchainProposalDto;
}