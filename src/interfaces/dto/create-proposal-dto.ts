import { AutoMap } from '@automapper/classes';
import { ClientProposalDto } from './client-proposal-dto';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProposalDto {

    @AutoMap(() => ClientProposalDto)
    @IsDefined()
    @ValidateNested()
    @Type(() => ClientProposalDto)
    clientProposal: ClientProposalDto;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    creatorSignature: string;

    constructor(proposal: ClientProposalDto, creatorSignature: string) {
        this.clientProposal = proposal;
        this.creatorSignature = creatorSignature;
    }
}