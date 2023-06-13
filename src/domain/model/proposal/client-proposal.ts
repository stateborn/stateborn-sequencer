import { AutoMap } from '@automapper/classes';
import { ProposalType } from './proposal-type';
import { IProposalData } from './i-proposal-data';

export class ClientProposal {

    @AutoMap()
    creatorAddress: string;
    @AutoMap()
    daoIpfsHash: string;
    @AutoMap()
    title: string;
    @AutoMap()
    description: string;
    @AutoMap()
    proposalType: ProposalType;
    @AutoMap()
    startDateUtc: string;
    @AutoMap()
    endDateUtc: string;

    readonly data?: IProposalData;

    constructor(creatorAddress: string, daoIpfsHash: string, title: string, description: string, proposalType: ProposalType, startDateUtc: string, endDateUtc: string, data?: IProposalData) {
        this.creatorAddress = creatorAddress;
        this.daoIpfsHash = daoIpfsHash;
        this.title = title;
        this.description = description;
        this.proposalType = proposalType;
        this.startDateUtc = startDateUtc;
        this.endDateUtc = endDateUtc;
        this.data = data;
    }
}