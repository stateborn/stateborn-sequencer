import { AutoMap } from '@automapper/classes';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientProposal } from '../../domain/model/proposal/client-proposal';

export class CreateProposalDto {

    @AutoMap(() => ClientProposal)
    @IsDefined()
    @ValidateNested()
    @Type(() => ClientProposal)
    clientProposal: ClientProposal;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    creatorSignature: string;

    constructor(clientProposal: ClientProposal, creatorSignature: string) {
        this.clientProposal = clientProposal;
        this.creatorSignature = creatorSignature;
    }
}