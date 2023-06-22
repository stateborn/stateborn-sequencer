import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { DaoTokenType } from '../../../domain/model/dao/dao-token-type';

export class ClientDaoToken {

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
    chainId: string;

    @AutoMap()
    @IsOptional()
    @IsNumberString()
    totalSupply?: string;

    constructor(address: string, name: string, symbol: string, type: DaoTokenType, chainId: string, totalSupply?: string) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.chainId = chainId;
        this.totalSupply = totalSupply;
    }
}