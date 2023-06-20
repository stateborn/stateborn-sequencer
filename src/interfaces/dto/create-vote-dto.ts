import { AutoMap } from '@automapper/classes';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientVote } from '../../domain/model/vote/client-vote';

export class CreateVoteDto {

    @AutoMap(() => ClientVote)
    @IsDefined()
    @ValidateNested()
    @Type(() => ClientVote)
    public readonly clientVote: ClientVote;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    public readonly userSignature: string;

    constructor(clientVote: ClientVote, userSignature: string) {
        this.clientVote = clientVote;
        this.userSignature = userSignature;
    }
}