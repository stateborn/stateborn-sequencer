import { AutoMap } from '@automapper/classes';
import { ProposalType } from './proposal-type';
import { IProposalData } from './i-proposal-data';

export class ClientProposal {

    @AutoMap()
    private readonly sequencerAddress: string;
    @AutoMap()
    private readonly title: string;
    @AutoMap()
    private readonly description: string;
    @AutoMap()
    private readonly tokenAddress: string;
    @AutoMap()
    private readonly proposalType: ProposalType;
    @AutoMap()
    private readonly startDateUtc: string;
    @AutoMap()
    private readonly endDateUtc: string;

    readonly data?: IProposalData;

    constructor(sequencerAddress: string, title: string, description: string, tokenAddress: string, proposalType: ProposalType, startDateUtc: string, endDateUtc: string, data?: IProposalData) {
        this.sequencerAddress = sequencerAddress;
        this.title = title;
        this.description = description;
        this.tokenAddress = tokenAddress;
        this.proposalType = proposalType;
        this.startDateUtc = startDateUtc;
        this.endDateUtc = endDateUtc;
        this.data = data;
    }

    public getSequencerAddress() {
        return this.sequencerAddress;
    }
    public getTitle() {
        return this.title;
    }
    public getDescription() {
        return this.description;
    }

    public getTokenAddress() {
        return this.tokenAddress;
    }

    public getProposalType() {
        return this.proposalType;
    }

    public getStartDateUtc() {
        return this.startDateUtc;
    }

    public getEndDateUtc() {
        return this.endDateUtc;
    }

    public getData(): IProposalData | undefined {
        return this.data;
    }
}