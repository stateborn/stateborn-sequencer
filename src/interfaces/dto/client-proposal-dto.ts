import { AutoMap } from '@automapper/classes';
import { IsEnum, IsJSON, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ProposalType } from '../../domain/model/proposal/proposal-type';
import { IProposalData } from '../../domain/model/proposal/i-proposal-data';

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

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    startDateUtc: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    endDateUtc: string;

    @AutoMap()
    @IsObject()
    @IsOptional()
    data?: IProposalData;

    constructor(sequencerAddress: string, title: string, description: string, tokenAddress: string, proposalType: ProposalType, startDateUtc: string, endDateUtc: string, data?: IProposalData) {
        this.sequencerAddress = sequencerAddress;
        this.title = title;
        this.description = description;
        this.tokenAddress = tokenAddress;
        this.proposalType = proposalType;
        this.startDateUtc = startDateUtc;
        this.endDateUtc = endDateUtc;
        this.data = data;
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

    getStartDateUtc() {
        return this.startDateUtc;
    }

    getEndDateUtc() {
        return this.endDateUtc;
    }

    getData(): IProposalData | undefined {
        return this.data;
    }
}