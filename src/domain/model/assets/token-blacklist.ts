import { TokenType } from '../dao/token-type';

export class TokenBlacklist {
    address: string;
    chainId: string;
    tokenType: TokenType;

    constructor(address: string, chainId: string, tokenType: TokenType) {
        this.address = address;
        this.chainId = chainId;
        this.tokenType = tokenType;
    }
}