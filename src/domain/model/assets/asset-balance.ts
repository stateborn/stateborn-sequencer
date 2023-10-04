import { TokenType } from '../dao/token-type';

export class AssetBalance {
    assetAddress: string;
    balance: number;
    tokenType: TokenType;
    nftId?: string;

    constructor(assetAddress: string, balance: number, tokenType: TokenType, nftId?: string) {
        this.assetAddress = assetAddress;
        this.balance = balance;
        this.tokenType = tokenType;
        this.nftId = nftId;
    }
}