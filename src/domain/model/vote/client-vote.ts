import { AutoMap } from '@automapper/classes';
import { IsISO8601, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ClientVote {

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    public readonly voterAddress: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    public readonly proposalIpfsHash: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    public readonly vote: string;

    @AutoMap()
    @IsNumberString()
    @IsNotEmpty()
    public readonly votingPower: string;

    @AutoMap()
    @IsISO8601()
    @IsNotEmpty()
    public voteDate: string;

    constructor(voterAddress: string, proposalIpfsHash: string, vote: string, votingPower: string, voteDate: string) {
        this.voterAddress = voterAddress;
        this.proposalIpfsHash = proposalIpfsHash;
        this.vote = vote;
        this.votingPower = votingPower;
        this.voteDate = voteDate;
    }
}