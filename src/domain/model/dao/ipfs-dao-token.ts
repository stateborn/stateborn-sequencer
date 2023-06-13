import { DaoTokenType } from './dao-token-type';

export class IpfsDaoToken {
    address: string;
    name: string;
    symbol: string;
    type: string;
    tokenType: DaoTokenType;
    network: string;
    data: any;

    constructor(address: string, name: string, symbol: string, type: string, tokenType: DaoTokenType, network: string, data: any) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.tokenType = tokenType;
        this.network = network;
        this.data = data;
    }
}