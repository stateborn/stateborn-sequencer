import { AutoMap } from '@automapper/classes';
import { ProposalType } from './proposal-type';

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

    constructor(sequencerAddress: string, title: string, description: string, tokenAddress: string, proposalType: ProposalType) {
        this.sequencerAddress = sequencerAddress;
        this.title = title;
        this.description = description;
        this.tokenAddress = tokenAddress;
        this.proposalType = proposalType;
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
}