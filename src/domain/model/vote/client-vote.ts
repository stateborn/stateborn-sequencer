import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

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

    constructor(voterAddress: string, proposalIpfsHash: string, vote: string, votingPower: string) {
        this.voterAddress = voterAddress;
        this.proposalIpfsHash = proposalIpfsHash;
        this.vote = vote;
        this.votingPower = votingPower;
    }
}