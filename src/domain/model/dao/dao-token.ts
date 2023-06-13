import { DaoTokenType } from './dao-token-type';

export class DaoToken {

    address: string;
    name: string;
    symbol: string;
    type: DaoTokenType;
    network: string;
    data?: any;
    //todo consider separating
    id?: string;

    constructor(address: string, name: string, symbol: string, type: DaoTokenType, network: string, data?: any, id?: string) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.type = type;
        this.network = network;
        this.data = data;
        this.id = id;
    }
}