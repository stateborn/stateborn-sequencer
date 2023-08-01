import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNumberString, IsString } from 'class-validator';
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
    @IsNumberString()
    chainId: string;

    @AutoMap()
    @IsNumberString()
    decimals: string;


    constructor(address: string, name: string, symbol: string, type: DaoTokenType, chainId: string, decimals: string) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.chainId = chainId;
        this.decimals = decimals;
    }
}