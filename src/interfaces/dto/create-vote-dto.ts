import { ClientVoteDto } from './client-vote-dto';
import { AutoMap } from '@automapper/classes';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientProposalDto } from './client-proposal-dto';

export class CreateVoteDto {

    @AutoMap(() => ClientVoteDto)
    @IsDefined()
    @ValidateNested()
    @Type(() => ClientVoteDto)
    private readonly clientVote: ClientVoteDto;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    private readonly userSignature: string;

    constructor(clientVote: ClientVoteDto, userSignature: string) {
        this.clientVote = clientVote;
        this.userSignature = userSignature;
    }

    public getClientVote(): ClientVoteDto {
        return this.clientVote;
    }

    public getUserSignature(): string {
        return this.userSignature;
    }
}