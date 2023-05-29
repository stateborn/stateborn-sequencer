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

export class AutomapperService {

    private readonly mapper: Mapper;
    constructor() {
        this.mapper = createMapper({
            strategyInitializer: classes(),
        });
        createMap(this.mapper, ClientProposalDto, ClientProposal);
        createMap(this.mapper, ClientProposal, ClientProposalDto);
        createMap(this.mapper, CreateProposalDto, IpfsProposal);
        createMap(this.mapper, Proposal, ProposalDto,
            forMember((d) => d.clientProposal, mapFrom((s) => this.mapper.map(s.getIpfsProposal().getClientProposal(), ClientProposal, ClientProposalDto))),
        );
        createMap(this.mapper, ClientVoteDto, ClientVote);
        createMap(this.mapper, CreateVoteDto, IpfsVote);
        createMap(this.mapper, ClientVote, ClientVoteDto);
        createMap(this.mapper, Vote, VoteDto,
            forMember((d) => d.clientVote, mapFrom((s) => this.mapper.map(s.getIpfsVote().getClientVote(), ClientVote, ClientVoteDto))),
        );
    }

    public map(source: any, sourceClass: any, destinationClass: any): any {
        return this.mapper.map(source, sourceClass, destinationClass);
    }
}