import { AutoMap } from '@automapper/classes';
import {
    IsArray,
    IsDefined,
    IsISO8601,
    IsNotEmpty,
    IsNumberString,
    IsString,
    MaxLength,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClientDaoToken } from './client-dao-token';

export class ClientDao {

    @AutoMap()
    @IsString()
    @IsDefined()
    @MaxLength(60)
    name: string;

    @AutoMap()
    @IsString()
    @IsDefined()
    @MaxLength(120)
    description: string;

    @AutoMap()
    @IsString()
    @IsDefined()
    imageBase64: string;

    @AutoMap()
    @IsArray()
    @IsNotEmpty()
    owners: string[];

    @AutoMap()
    @IsString()
    @IsDefined()
    @IsNumberString()
    ownersMultisigThreshold: string;

    @AutoMap()
    @IsString()
    @IsDefined()
    @IsNumberString()
    proposalTokenRequiredQuantity: string;

    @AutoMap()
    @IsString()
    @IsDefined()
    @IsISO8601()
    creationDateUtc: string;

    @AutoMap()
    @ValidateNested()
    @Type(() => ClientDaoToken)
    token: ClientDaoToken;

    constructor(name: string, description: string, imageBase64: string, owners: string[], ownersMultisigThreshold: string, proposalTokenRequiredQuantity: string,
                creationDateUtc: string, token: ClientDaoToken) {
        this.name = name;
        this.description = description;
        this.imageBase64 = imageBase64;
        this.owners = owners;
        this.ownersMultisigThreshold = ownersMultisigThreshold;
        this.proposalTokenRequiredQuantity = proposalTokenRequiredQuantity;
        this.creationDateUtc = creationDateUtc;
        this.token = token;
    }
}