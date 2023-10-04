import { AssetBalance } from '../model/assets/asset-balance';

export interface ICacheAssetsBalancesRepository {

    getBalances(ownerAddress: string, chainId: string): AssetBalance[];
    saveBalances(ownerAddress: string, chainId: string, assetBalances: AssetBalance[]): void;
}