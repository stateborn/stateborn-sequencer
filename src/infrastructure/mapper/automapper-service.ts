import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CreateProposalDto } from '../../interfaces/dto/create-proposal-dto';
import { Mapper } from '@automapper/core/lib/types';
import { ProposalDto } from '../../interfaces/dto/proposal-dto';
import { IpfsProposal } from '../../domain/model/proposal/ipfs-proposal';
import { Proposal } from '../../domain/model/proposal/proposal';
import { CreateVoteDto } from '../../interfaces/dto/create-vote-dto';
import { IpfsVote } from '../../domain/model/vote/ipfs-vote';
import { Vote } from '../../domain/model/vote/vote';
import { VoteDto } from '../../interfaces/dto/vote-dto';
import { ProposalReport } from '../../domain/model/proposal/report/proposal-report';
import { ProposalReportDto } from '../../interfaces/dto/report/proposal-report-dto';
import { Dao } from '../../domain/model/dao/dao';
import { DaoDto } from '../../interfaces/dto/dao/dao-dto';

export class AutomapperService {

    private readonly mapper: Mapper;
    constructor() {
        this.mapper = createMapper({
            strategyInitializer: classes(),
        });
        createMap(this.mapper, CreateProposalDto, IpfsProposal);
        createMap(this.mapper, Proposal, ProposalDto,
            forMember((d) => d.clientProposal, mapFrom((s) => s.ipfsProposal.clientProposal)),
        );
        createMap(this.mapper, ProposalReport, ProposalReportDto,
            forMember((d) => d.merkleRootHex, mapFrom((s) => s.ipfsProposalReport.merkleRootHex)),
        );
        createMap(this.mapper, CreateVoteDto, IpfsVote);
        createMap(this.mapper, Vote, VoteDto,
            forMember((d) => d.clientVote, mapFrom((s) => s.ipfsVote.clientVote)),
        );
        createMap(this.mapper, Dao, DaoDto,
            forMember((d) => d.clientDao, mapFrom((s) => s.ipfsDao.clientDao)),
            forMember((d) => d.signature, mapFrom((s) => s.ipfsDao.signature)),
        );
    }

    public map(source: any, sourceClass: any, destinationClass: any): any {
        return this.mapper.map(source, sourceClass, destinationClass);
    }
}