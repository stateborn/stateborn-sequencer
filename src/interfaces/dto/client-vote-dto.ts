import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClientVoteDto {

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    private readonly voterAddress: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    private readonly proposalIpfsHash: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    private readonly vote: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
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