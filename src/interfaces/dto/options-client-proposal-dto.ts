import { ClientProposalDto } from './client-proposal-dto';
import { ProposalType } from '../../domain/model/proposal/proposal-type';
import { AutoMap } from '@automapper/classes';
import { IsArray, IsNotEmpty } from 'class-validator';

export class OptionsClientProposalDto extends ClientProposalDto {

    @AutoMap()
    @IsArray()
    @IsNotEmpty()
    options: string[];

    constructor(sequencerAddress: string, title: string, description: string, tokenAddress: string, proposalType: ProposalType, startDateUtc: string, endDateUtc: string, options: string[]) {
        super(sequencerAddress, title, description, tokenAddress, proposalType, startDateUtc, endDateUtc);
        this.options = options;
    }

    getOptions() {
        return this.options;
    }
}