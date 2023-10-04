import { Nft } from './nft';
import { AutoMap } from '@automapper/classes';
import { Token } from '../dao/token';

export class AssetData {
    @AutoMap(() => Token)
    token: Token;

    //only for AssetType.NFT
    @AutoMap(() => Nft)
    nft?: Nft;

    constructor(token: Token, nft?: Nft) {
        this.token = token;
        this.nft = nft;
    }
}