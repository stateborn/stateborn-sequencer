import { AutoMap } from '@automapper/classes';
import { AssetDataDto } from './asset-data-dto';

export class AssetDto {
    @AutoMap(() => AssetDataDto)
    assetData: AssetDataDto;

    @AutoMap()
    assetBalance: number;
    
    constructor(assetData: AssetDataDto, assetBalance: number) {
        this.assetData = assetData;
        this.assetBalance = assetBalance;
    }
}