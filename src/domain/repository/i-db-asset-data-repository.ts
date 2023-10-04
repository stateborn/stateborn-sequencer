import { AssetData } from '../model/assets/asset-data';
import { TokenBlacklist } from '../model/assets/token-blacklist';

export interface IDbAssetDataRepository {
    saveAssetsData(assets: AssetData[]): Promise<void>;
    readAssetData(address: string, chainId: string, nftId?: string): Promise<AssetData | undefined>;
    saveTokenBlacklist(tokensBlacklist: TokenBlacklist[]): Promise<void>;
    isTokenBlacklist(tokenBlacklist: TokenBlacklist): Promise<boolean>;
}