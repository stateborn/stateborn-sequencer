import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProposalType } from '../../domain/model/proposal/proposal-type';

export class ClientProposalDto {

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    sequencerAddress: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    title: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    description: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    tokenAddress: string;

    @AutoMap()
    @IsEnum(ProposalType)
    proposalType: ProposalType;

    constructor(sequencerAddress: string, title: string, description: string, tokenAddress: string, proposalType: ProposalType) {
        this.sequencerAddress = sequencerAddress;
        this.title = title;
        this.description = description;
        this.tokenAddress = tokenAddress;
        this.proposalType = proposalType;
    }

    getSequencerAddress() {
        return this.sequencerAddress;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getTokenAddress() {
        return this.tokenAddress;
    }

    getProposalType() {
        return this.proposalType;
    }
}