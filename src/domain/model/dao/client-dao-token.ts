import { DaoTokenType } from './dao-token-type';

export class ClientDaoToken {
    address: string;
    name: string;
    symbol: string;
    tokenType: DaoTokenType;
    network: string;
    data: any;

    constructor(address: string, name: string, symbol: string, tokenType: DaoTokenType, network: string, data: any) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.tokenType = tokenType;
        this.network = network;
        this.data = data;
    }
}