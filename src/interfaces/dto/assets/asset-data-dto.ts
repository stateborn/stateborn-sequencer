import { AutoMap } from '@automapper/classes';
import { ClientToken } from '../../../domain/model/dao/client-token';
import { NftDto } from './nft-dto';

export class AssetDataDto {
    @AutoMap(() => ClientToken)
    token: ClientToken;

        //only for AssetType.NFT
    @AutoMap(() => NftDto)
    nft?: NftDto;

    constructor(token: ClientToken, nft: NftDto) {
        this.token = token;
        this.nft = nft;
    }
}