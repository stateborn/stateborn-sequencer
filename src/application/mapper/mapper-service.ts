import { IMapperService } from '../../domain/service/i-mapper-service';
import { CreateProposalDto } from '../../interfaces/dto/create-proposal-dto';
import { AutomapperService } from '../../infrastructure/mapper/automapper-service';
import { ProposalDto } from '../../interfaces/dto/proposal-dto';
import { CreateVoteDto } from '../../interfaces/dto/create-vote-dto';
import { IpfsVote } from '../../domain/model/vote/ipfs-vote';
import { IpfsProposal } from '../../domain/model/proposal/ipfs-proposal';
import { Proposal } from '../../domain/model/proposal/proposal';
import { Vote } from '../../domain/model/vote/vote';
import { VoteDto } from '../../interfaces/dto/vote-dto';
import { ProposalWithReport } from '../../domain/model/proposal/proposal-with-report';
import { ProposalWithReportDto } from '../../interfaces/dto/proposal-with-report-dto';
import { Dao } from '../../domain/model/dao/dao';
import { DaoDto } from '../../interfaces/dto/dao/dao-dto';

export class MapperService implements IMapperService {

    private readonly automapperService: AutomapperService;

    constructor({automapperService}: { automapperService: AutomapperService }) {
        this.automapperService = automapperService;
    }

    toIpfsProposal(createProposalDto: CreateProposalDto): IpfsProposal {
        return this.automapperService.map(createProposalDto, CreateProposalDto, IpfsProposal);
    }

    toProposalWithReportDto(proposalWithReport: ProposalWithReport): ProposalWithReportDto {
        return this.automapperService.map(proposalWithReport, ProposalWithReport, ProposalWithReportDto);
    }

    toProposalDto(proposal: Proposal): ProposalDto {
        return this.automapperService.map(proposal, Proposal, ProposalDto);
    }

    toIpfsVote(createVoteDto: CreateVoteDto): IpfsVote {
        return this.automapperService.map(createVoteDto, CreateVoteDto, IpfsVote);
    }

    toVoteDto(vote: Vote): VoteDto {
        return this.automapperService.map(vote, Vote, VoteDto);
    }

    toDaoDto(dao: Dao): DaoDto {
        return this.automapperService.map(dao, Dao, DaoDto);
    }
}
