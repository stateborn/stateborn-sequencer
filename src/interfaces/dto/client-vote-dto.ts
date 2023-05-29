import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { YesNoVote } from '../../domain/model/vote/yes-no-vote';

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
    @IsEnum(YesNoVote)
    private readonly vote: YesNoVote;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
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