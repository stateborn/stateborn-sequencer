import { AutoMap } from '@automapper/classes';
import { IsEnum, IsString } from 'class-validator';
import { DaoTokenType } from '../../../domain/model/dao/dao-token-type';

export class ClientDaoTokenDto {

    @AutoMap()
    @IsString()
    address: string;

    @AutoMap()
    @IsString()
    name: string;

    @AutoMap()
    @IsString()
    symbol: string;

    @AutoMap()
    @IsEnum(DaoTokenType)
    type: DaoTokenType;

    @AutoMap()
    @IsString()
    network: string;

    constructor(address: string, name: string, symbol: string, type: DaoTokenType, network: string) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.network = network;
    }
}