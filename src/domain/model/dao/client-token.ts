import { AutoMap } from '@automapper/classes';
import { IsEnum, IsNumberString, IsString } from 'class-validator';
import { TokenType } from './token-type';

export class ClientToken {

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
    @IsEnum(TokenType)
    type: TokenType;

    @AutoMap()
    @IsNumberString()
    chainId: string;

    @AutoMap()
    @IsNumberString()
    decimals: string;


    constructor(address: string, name: string, symbol: string, type: TokenType, chainId: string, decimals: string) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.chainId = chainId;
        this.decimals = decimals;
    }
}