import { createMap, createMapper, forMember, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import { CreateProposalDto } from '../../interfaces/dto/create-proposal-dto';
import { Mapper } from '@automapper/core/lib/types';
import { ClientProposalDto } from '../../interfaces/dto/client-proposal-dto';
import { ProposalDto } from '../../interfaces/dto/proposal-dto';
import { IpfsProposal } from '../../domain/model/proposal/ipfs-proposal';
import { ClientProposal } from '../../domain/model/proposal/client-proposal';
import { Proposal } from '../../domain/model/proposal/proposal';
import { CreateVoteDto } from '../../interfaces/dto/create-vote-dto';
import { IpfsVote } from '../../domain/model/vote/ipfs-vote';
import { ClientVoteDto } from '../../interfaces/dto/client-vote-dto';
import { ClientVote } from '../../domain/model/vote/client-vote';
import { Vote } from '../../domain/model/vote/vote';
import { VoteDto } from '../../interfaces/dto/vote-dto';
import { ProposalType } from '../../domain/model/proposal/proposal-type';
import { ProposalWithReport } from '../../domain/model/proposal/proposal-with-report';
import { ProposalWithReportDto } from '../../interfaces/dto/proposal-with-report-dto';
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
        createMap(this.mapper, ClientProposalDto, ClientProposal,
            forMember((d) => d.data, mapFrom((s) => {
                switch (s.proposalType) {
                    case ProposalType.YES_NO:
                        return undefined;
                    case ProposalType.OPTIONS:
                        return {
                            // @ts-ignore
                            options: s.data!.options,
                        }
                    default:
                        throw new Error(`Unknown proposal type: ${s.proposalType}`);
                }
            })),
        );
        createMap(this.mapper, ClientProposal, ClientProposalDto,
            forMember((d) => d.data, mapFrom((s) => {
                switch (s.proposalType) {
                    case ProposalType.YES_NO:
                        return undefined;
                    case ProposalType.OPTIONS:
                        return {
                            // @ts-ignore
                            options: s.data!.options,
                        }
                    default:
                        throw new Error(`Unknown proposal type: ${s.proposalType}`);
                }
            })),
        );
        createMap(this.mapper, CreateProposalDto, IpfsProposal);
        createMap(this.mapper, Proposal, ProposalDto,
            forMember((d) => d.clientProposal, mapFrom((s) => this.mapper.map(s.getIpfsProposal().clientProposal, ClientProposal, ClientProposalDto))),
        );
        createMap(this.mapper, ProposalReport, ProposalReportDto,
            forMember((d) => d.merkleRootHex, mapFrom((s) => s.ipfsProposalReport.merkleRootHex)),
        );
        createMap(this.mapper, ProposalWithReport, ProposalWithReportDto,
            forMember((d) => d.proposal.clientProposal, mapFrom((s) => this.mapper.map(s.proposal.ipfsProposal.clientProposal, ClientProposal, ClientProposalDto))),
        );
        createMap(this.mapper, ClientVoteDto, ClientVote);
        createMap(this.mapper, CreateVoteDto, IpfsVote);
        createMap(this.mapper, ClientVote, ClientVoteDto);
        createMap(this.mapper, Vote, VoteDto,
            forMember((d) => d.clientVote, mapFrom((s) => this.mapper.map(s.getIpfsVote().getClientVote(), ClientVote, ClientVoteDto))),
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