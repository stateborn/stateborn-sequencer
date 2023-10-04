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
import { Dao } from '../../domain/model/dao/dao';
import { DaoDto } from '../../interfaces/dto/dao/dao-dto';
import { ProposalReportDto } from '../../interfaces/dto/report/proposal-report-dto';
import { ProposalReport } from '../../domain/model/proposal/report/proposal-report';
import { BlockchainProposal } from '../../domain/model/proposal/proposal-transaction/blockchain-proposal';
import { BlockchainProposalDto } from '../../interfaces/dto/proposal/blockchain-proposal-dto';
import { Asset } from '../../domain/model/assets/asset';
import { AssetDto } from '../../interfaces/dto/assets/asset-dto';

export class MapperService implements IMapperService {

    private readonly automapperService: AutomapperService;

    constructor({automapperService}: { automapperService: AutomapperService }) {
        this.automapperService = automapperService;
    }

    toIpfsProposal(createProposalDto: CreateProposalDto): IpfsProposal {
        return this.automapperService.map(createProposalDto, CreateProposalDto, IpfsProposal);
    }

    toProposalReportDto(proposalReport: ProposalReport): ProposalReportDto {
        return this.automapperService.map(proposalReport, ProposalReport, ProposalReportDto);
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

    toBlockchainProposalDto(blockchainProposal: BlockchainProposal): BlockchainProposalDto {
        return this.automapperService.map(blockchainProposal, BlockchainProposal, BlockchainProposalDto);
    }

    toAssetDto(assets: Asset): AssetDto {
        return this.automapperService.map(assets, Asset, AssetDto);
    }

}
