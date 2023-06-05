import { AutoMap } from '@automapper/classes';
import { ClientProposalDto } from './client-proposal-dto';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProposalDto {

    @AutoMap(() => ClientProposalDto)
    @IsDefined()
    @ValidateNested()
    @Type(() => ClientProposalDto)
    private readonly clientProposal: ClientProposalDto;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    private readonly sequencerSignature: string;

    constructor(proposal: ClientProposalDto, sequencerSignature: string) {
        this.clientProposal = proposal;
        this.sequencerSignature = sequencerSignature;
    }

    public getClientProposal(): ClientProposalDto {
        return this.clientProposal;
    }

    public getSequencerSignature(): string {
        return this.sequencerSignature;
    }
}