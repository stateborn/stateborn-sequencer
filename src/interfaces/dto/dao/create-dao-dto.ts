import { AutoMap } from '@automapper/classes';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientDaoDto } from './client-dao-dto';

export class CreateDaoDto {

    @AutoMap()
    @IsDefined()
    @ValidateNested()
    @Type(() => ClientDaoDto)
    clientDao: ClientDaoDto;

    @AutoMap()
    @IsString()
    @IsDefined()
    signature: string;

    @AutoMap()
    @IsString()
    @IsDefined()
    creatorAddress: string;

    constructor(clientDao: ClientDaoDto, signature: string, creatorAddress: string) {
        this.clientDao = clientDao;
        this.signature = signature;
        this.creatorAddress = creatorAddress;
    }
}