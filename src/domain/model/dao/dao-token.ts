import { DaoTokenType } from './dao-token-type';

export class DaoToken {

    address: string;
    name: string;
    symbol: string;
    type: DaoTokenType;
    chainId: string;
    decimals: number;
    data?: any;
    //todo consider separating
    id?: string;

    constructor(address: string, name: string, symbol: string, type: DaoTokenType, chainId: string, decimals: number, data?: any, id?: string) {
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