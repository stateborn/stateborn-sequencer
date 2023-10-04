import { IEthProvider } from '../application/i-eth-provider';
import { EthNetworkProvider } from './eth-network-provider';
import { ArbitrumNetworkProvider } from './arbitrum-network-provider';
import { PolygonNetworkProvider } from './polygon-network-provider';
import { getProperty } from '../application/env-var/env-var-service';
import { LocalhostNetworkProvider } from './localhost-network-provider';
import {
    ARBITRUM_CHAIN_ID,
    DEVELOPMENT_NETWORK_CHAIN_ID,
    ETHEREUM_MAINNET_CHAIN_ID,
    POLYGON_MAINNET_CHAIN_ID,
    SUPPORTED_CHAIN_IDS
} from '../application/app-constants';

export class NetworkProviderService {

    private readonly ethNetworkProvider: EthNetworkProvider;
    private readonly polygonNetworkProvider: PolygonNetworkProvider;
    private readonly arbitrumNetworkProvider: ArbitrumNetworkProvider;
    private readonly localhostNetworkProvider: LocalhostNetworkProvider;

    constructor({ethNetworkProvider, arbitrumNetworkProvider, polygonNetworkProvider, localhostNetworkProvider}: {
        ethNetworkProvider: EthNetworkProvider,
        arbitrumNetworkProvider: ArbitrumNetworkProvider
        polygonNetworkProvider: PolygonNetworkProvider
        localhostNetworkProvider: LocalhostNetworkProvider
    }) {
        this.ethNetworkProvider = ethNetworkProvider;
        this.arbitrumNetworkProvider = arbitrumNetworkProvider;
        this.polygonNetworkProvider = polygonNetworkProvider;
        this.localhostNetworkProvider = localhostNetworkProvider;
    }

    isSupportedChainId(chainId: string): boolean {
        return SUPPORTED_CHAIN_IDS.includes(chainId);
    }

    getNetworkName(chainId: string): string {
        switch (chainId) {
            case ETHEREUM_MAINNET_CHAIN_ID:
                return 'Ethereum Mainnet';
            case ARBITRUM_CHAIN_ID:
                return 'Arbitrum';
            case POLYGON_MAINNET_CHAIN_ID:
                return 'Polygon';
            case DEVELOPMENT_NETWORK_CHAIN_ID:
                return getProperty('DEVELOPMENT_NETWORK_NAME');
            default:
                throw new Error(`Cannot get network name! Unsupported chainId: ' + chainId`);
        }
    }


    getNetworkProvider(chainId: string): IEthProvider {
        switch (chainId) {
            case ETHEREUM_MAINNET_CHAIN_ID:
                return this.ethNetworkProvider;
            case ARBITRUM_CHAIN_ID:
                return this.arbitrumNetworkProvider;
            case POLYGON_MAINNET_CHAIN_ID:
                return this.polygonNetworkProvider;
            case DEVELOPMENT_NETWORK_CHAIN_ID:
                return this.localhostNetworkProvider;
            default:
                throw new Error(`Unsupported chainId: ${chainId}. There is no provider for this chain yet!`);
        }
    }

}