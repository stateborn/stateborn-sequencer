import { AutoMap } from '@automapper/classes';

export class ClientVote {

    @AutoMap()
    voterAddress: string;
    @AutoMap()
    proposalIpfsHash: string;
    @AutoMap()
    vote: string;
    @AutoMap()
    votingPower: string;

    constructor(voterAddress: string, proposalIpfsHash: string, vote: string, votingPower: string) {
        this.voterAddress = voterAddress;
        this.proposalIpfsHash = proposalIpfsHash;
        this.vote = vote;
        this.votingPower = votingPower;
    }
}