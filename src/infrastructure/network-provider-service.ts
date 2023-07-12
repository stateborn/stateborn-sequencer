import { IEthProvider } from '../application/i-eth-provider';
import { EthNetworkProvider } from './eth-network-provider';
import { ArbitrumNetworkProvider } from './arbitrum-network-provider';
import { PolygonNetworkProvider } from './polygon-network-provider';
import { getBooleanProperty, getProperty } from '../application/env-var/env-var-service';
import { LocalhostNetworkProvider } from './localhost-network-provider';

export class NetworkProviderService {

    private readonly ethNetworkProvider: EthNetworkProvider;
    private readonly polygonNetworkProvider: PolygonNetworkProvider;
    private readonly arbitrumNetworkProvider: ArbitrumNetworkProvider;
    private readonly localhostNetworkProvider: LocalhostNetworkProvider;

    public static readonly ARBITRUM_CHAIN_ID = '42161';
    public static readonly ETHEREUM_MAINNET_CHAIN_ID = '1';
    public static readonly POLYGON_MAINNET_CHAIN_ID = '137';
    public static readonly DEVELOPMENT_NETWORK_CHAIN_ID = getProperty('DEVELOPMENT_NETWORK_CHAIN_ID');
    private static readonly SUPPORTED_CHAIN_IDS = getBooleanProperty('IS_DEVELOPMENT_MODE') ?
        [this.ETHEREUM_MAINNET_CHAIN_ID, this.ARBITRUM_CHAIN_ID, this.POLYGON_MAINNET_CHAIN_ID, this.DEVELOPMENT_NETWORK_CHAIN_ID] :
        [this.ETHEREUM_MAINNET_CHAIN_ID, this.ARBITRUM_CHAIN_ID, this.POLYGON_MAINNET_CHAIN_ID];


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
        return NetworkProviderService.SUPPORTED_CHAIN_IDS.includes(chainId);
    }

    getNetworkName(chainId: string): string {
        switch (chainId) {
            case NetworkProviderService.ETHEREUM_MAINNET_CHAIN_ID:
                return 'Ethereum Mainnet';
            case NetworkProviderService.ARBITRUM_CHAIN_ID:
                return 'Arbitrum';
            case NetworkProviderService.POLYGON_MAINNET_CHAIN_ID:
                return 'Polygon';
            case NetworkProviderService.DEVELOPMENT_NETWORK_CHAIN_ID:
                return getProperty('DEVELOPMENT_NETWORK_NAME');
            default:
                throw new Error(`Cannot get network name! Unsupported chainId: ' + chainId`);
        }
    }


    getNetworkProvider(chainId: string): IEthProvider {
        switch (chainId) {
            case NetworkProviderService.ETHEREUM_MAINNET_CHAIN_ID:
                return this.ethNetworkProvider;
            case NetworkProviderService.ARBITRUM_CHAIN_ID:
                return this.arbitrumNetworkProvider;
            case NetworkProviderService.POLYGON_MAINNET_CHAIN_ID:
                return this.polygonNetworkProvider;
            case NetworkProviderService.DEVELOPMENT_NETWORK_CHAIN_ID:
                return this.localhostNetworkProvider;
            default:
                throw new Error(`Unsupported chainId: ${chainId}. There is no provider for this chain yet!`);
        }
    }

}