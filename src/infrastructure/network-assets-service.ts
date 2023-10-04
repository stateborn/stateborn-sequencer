import { IAssetsService } from '../domain/service/assets/i-assets-service';
import { POLYGON_MAINNET_CHAIN_ID } from '../application/app-constants';

export class NetworkAssetsService {

    private readonly polygonAssetsService: IAssetsService;

    constructor({polygonAssetsService}: {
        polygonAssetsService: IAssetsService,
    }) {
        this.polygonAssetsService = polygonAssetsService;
    }

    getAssetsService(chainId: string): IAssetsService {
        switch (chainId) {
            case POLYGON_MAINNET_CHAIN_ID:
                return this.polygonAssetsService;
                break;
            default:
                throw new Error(`Cannot get assets service! Unsupported chainId: ${chainId}`);
        }
    }



}