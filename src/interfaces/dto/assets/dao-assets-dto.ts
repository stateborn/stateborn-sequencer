import { AssetDto } from './asset-dto';

export class DaoAssetsDto {
    assets: AssetDto[];
    cryptoBalanceFormatted: string;
    chainId: string;

    constructor(assets: AssetDto[], cryptoBalanceFormatted: string, chainId: string) {
        this.assets = assets;
        this.cryptoBalanceFormatted = cryptoBalanceFormatted;
        this.chainId = chainId;
    }
}