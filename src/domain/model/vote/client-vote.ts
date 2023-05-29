import { YesNoVote } from './yes-no-vote';
import { AutoMap } from '@automapper/classes';

export class ClientVote {

    @AutoMap()
    private readonly voterAddress: string;
    @AutoMap()
    private readonly proposalIpfsHash: string;
    @AutoMap()
    private readonly vote: YesNoVote;
    @AutoMap()
    private readonly votingPower: string;

    constructor(voterAddress: string, proposalIpfsHash: string, vote: YesNoVote, votingPower: string) {
        this.voterAddress = voterAddress;
        this.proposalIpfsHash = proposalIpfsHash;
        this.vote = vote;
        this.votingPower = votingPower;
    }

    public getVoterAddress(): string {
        return this.voterAddress;
    }

    public getProposalIpfsHash(): string {
        return this.proposalIpfsHash;
    }

    public getVote(): YesNoVote {
        return this.vote;
    }

    public getVotingPower(): string {
        return this.votingPower;
    }
}