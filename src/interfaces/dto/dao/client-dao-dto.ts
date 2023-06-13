import { AutoMap } from '@automapper/classes';
import { IsArray, IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientDaoTokenDto } from './client-dao-token-dto';

export class ClientDaoDto {

    @AutoMap()
    @IsString()
    @IsDefined()
    name: string;

    @AutoMap()
    @IsString()
    @IsDefined()
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
    ownersMultisigThreshold: string;

    @AutoMap()
    @IsString()
    @IsDefined()
    proposalTokenRequiredQuantity: string;

    @AutoMap()
    @ValidateNested()
    @Type(() => ClientDaoTokenDto)
    token: ClientDaoTokenDto;

    constructor(name: string, description: string, imageBase64: string, owners: string[], ownersMultisigThreshold: string, proposalTokenRequiredQuantity: string, token: ClientDaoTokenDto) {
        this.name = name;
        this.description = description;
        this.imageBase64 = imageBase64;
        this.owners = owners;
        this.ownersMultisigThreshold = ownersMultisigThreshold;
        this.proposalTokenRequiredQuantity = proposalTokenRequiredQuantity;
        this.token = token;
    }
}