import { AutoMap } from '@automapper/classes';
import { ProposalType } from './proposal-type';
import { IProposalData } from './i-proposal-data';
import {
    IsArray, IsDecimal, IsDefined,
    IsEnum,
    IsISO8601,
    IsNotEmpty,
    IsNumberString,
    IsObject,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator';
import { ClientProposalTransaction } from './client-proposal-transaction';

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
    @MaxLength(120)
    title: string;

    @AutoMap()
    @IsString()
    @IsNotEmpty()
    description: string;

    @AutoMap()
    @IsEnum(ProposalType)
    @IsDefined()
    proposalType: ProposalType;

    @AutoMap()
    @IsISO8601()
    @IsNotEmpty()
    startDateUtc: string;

    @AutoMap()
    @IsISO8601()
    @IsNotEmpty()
    endDateUtc: string;

    @AutoMap()
    @IsNotEmpty()
    @IsNumberString()
    blockNumber: string;

    @AutoMap()
    @IsObject()
    @IsOptional()
    data?: IProposalData;

    @AutoMap()
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    transactions?: ClientProposalTransaction[];

    constructor(creatorAddress: string, daoIpfsHash: string, title: string, description: string, proposalType: ProposalType, startDateUtc: string, endDateUtc: string, blockNumber: string, data?: IProposalData,
                transactions?: ClientProposalTransaction[]) {
        this.creatorAddress = creatorAddress;
        this.daoIpfsHash = daoIpfsHash;
        this.title = title;
        this.description = description;
        this.proposalType = proposalType;
        this.startDateUtc = startDateUtc;
        this.endDateUtc = endDateUtc;
        this.blockNumber = blockNumber;
        this.data = data;
        this.transactions = transactions;
    }
}