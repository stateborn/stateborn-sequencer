import { ICacheAssetsBalancesRepository } from '../../domain/repository/i-cache-assets-balances-repository';
import { CacheService } from '../cache-service';
import { AssetBalance } from '../../domain/model/assets/asset-balance';

export class CacheAssetsBalancesRepository implements ICacheAssetsBalancesRepository {
    private cacheService: CacheService;

    constructor({cacheService}: {
        cacheService: CacheService,
    }) {
        this.cacheService = cacheService;
    }

    getBalances(ownerAddress: string, chainId: string): AssetBalance[] {
        const val = this.cacheService.getFromCache(`${ownerAddress.toLowerCase()}-${chainId.toLowerCase()}`);
        return val ? val : [];
    }

    saveBalances(ownerAddress: string, chainId: string, assetBalances: AssetBalance[]): void {
        this.cacheService.setToCache(`${ownerAddress.toLowerCase()}-${chainId.toLowerCase()}`, assetBalances);
    }
}