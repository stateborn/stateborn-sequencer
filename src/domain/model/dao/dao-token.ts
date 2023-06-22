import { DaoTokenType } from './dao-token-type';

export class DaoToken {

    address: string;
    name: string;
    symbol: string;
    type: DaoTokenType;
    chainId: string;
    // only for ERC-20
    totalSupply?: number;
    data?: any;
    //todo consider separating
    id?: string;

    constructor(address: string, name: string, symbol: string, type: DaoTokenType, chainId: string, totalSupply?: number, data?: any, id?: string) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.chainId = chainId;
        this.totalSupply = totalSupply;
        this.data = data;
        this.id = id;
    }
}