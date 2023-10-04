import { AlchemySdkService } from '../alchemy-sdk-service';
import { AlchemyAssetsService } from './alchemy-assets-service';
import { ICacheAssetsBalancesRepository } from '../../domain/repository/i-cache-assets-balances-repository';
import { POLYGON_MAINNET_CHAIN_ID } from '../../application/app-constants';
import { IDbAssetDataRepository } from '../../domain/repository/i-db-asset-data-repository';
import { TokenDataService } from '../../application/dao/token-data-service';
import { NftImageService } from './nft-image-service';

export class PolygonAssetsService extends AlchemyAssetsService {

    constructor({alchemySdkService, cacheAssetsBalancesRepository, assetDataRepository, tokenDataService, nftImageService}: {
        alchemySdkService: AlchemySdkService,
        cacheAssetsBalancesRepository: ICacheAssetsBalancesRepository,
        assetDataRepository: IDbAssetDataRepository
        tokenDataService: TokenDataService,
        nftImageService: NftImageService
    }) {
        super({
            alchemySdkService,
            cacheAssetsBalancesRepository,
            assetDataRepository,
            tokenDataService,
            nftImageService,
            chainId: POLYGON_MAINNET_CHAIN_ID
        });
    }
}