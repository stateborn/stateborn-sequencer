import { AssetData } from './asset-data';
import { AutoMap } from '@automapper/classes';

export class Asset {
    @AutoMap(() => AssetData)
    assetData: AssetData;
    @AutoMap()
    assetBalance: number;

    constructor(assetData: AssetData, assetBalance: number) {
        this.assetData = assetData;
        this.assetBalance = assetBalance;
    }
}