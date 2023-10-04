import { Asset } from '../../model/assets/asset';

export interface IAssetsService {
    getAssets(ownerAddress: string): Promise<Asset[]>;
}