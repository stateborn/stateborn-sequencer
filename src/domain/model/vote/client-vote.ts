import { AutoMap } from '@automapper/classes';

export class ClientVote {

    @AutoMap()
    private readonly voterAddress: string;
    @AutoMap()
    private readonly proposalIpfsHash: string;
    @AutoMap()
    private readonly vote: string;
    @AutoMap()
    private readonly votingPower: string;

    constructor(voterAddress: string, proposalIpfsHash: string, vote: string, votingPower: string) {
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

    public getVote(): string {
        return this.vote;
    }

    public getVotingPower(): string {
        return this.votingPower;
    }
}