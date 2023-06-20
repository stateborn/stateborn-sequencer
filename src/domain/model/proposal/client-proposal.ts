import { AutoMap } from '@automapper/classes';
import { ProposalType } from './proposal-type';
import { IProposalData } from './i-proposal-data';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ClientProposal {

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    creatorAddress: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    daoIpfsHash: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    title: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    description: string;

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
    @IsString()
    @IsNotEmpty()
    blockNumber: string;

    @AutoMap()
    @IsObject()
    @IsOptional()
    data?: IProposalData;

    constructor(creatorAddress: string, daoIpfsHash: string, title: string, description: string, proposalType: ProposalType, startDateUtc: string, endDateUtc: string, blockNumber: string, data?: IProposalData) {
        this.creatorAddress = creatorAddress;
        this.daoIpfsHash = daoIpfsHash;
        this.title = title;
        this.description = description;
        this.proposalType = proposalType;
        this.startDateUtc = startDateUtc;
        this.endDateUtc = endDateUtc;
        this.blockNumber = blockNumber;
        this.data = data;
    }
}