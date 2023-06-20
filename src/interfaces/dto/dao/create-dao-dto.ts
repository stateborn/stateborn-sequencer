import { AutoMap } from '@automapper/classes';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientDao } from '../../../domain/model/dao/client-dao';

export class CreateDaoDto {

    @AutoMap()
    @IsDefined()
    @ValidateNested()
    @Type(() => ClientDao)
    clientDao: ClientDao;

    @AutoMap()
    @IsString()
    @IsDefined()
    signature: string;

    @AutoMap()
    @IsString()
    @IsDefined()
    creatorAddress: string;

    constructor(clientDao: ClientDao, signature: string, creatorAddress: string) {
        this.clientDao = clientDao;
        this.signature = signature;
        this.creatorAddress = creatorAddress;
    }
}