import { TokenType } from './token-type';
import { AutoMap } from '@automapper/classes';

export class Token {

    @AutoMap()
    address: string;
    @AutoMap()
    name: string;
    @AutoMap()
    symbol: string;
    @AutoMap()
    type: TokenType;
    @AutoMap()
    chainId: string;
    @AutoMap()
    decimals: number;

    data?: any;
    //todo consider separating
    id?: string;

    constructor(address: string, name: string, symbol: string, type: TokenType, chainId: string, decimals: number, data?: any, id?: string) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.chainId = chainId;
        this.data = data;
        this.decimals = decimals;
        this.id = id;
    }
}