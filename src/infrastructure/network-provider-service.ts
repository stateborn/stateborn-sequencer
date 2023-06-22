import { IEthProvider } from '../application/i-eth-provider';
import { EthNetworkProvider } from './eth-network-provider';
import { ArbitrumNetworkProvider } from './arbitrum-network-provider';
import { PolygonNetworkProvider } from './polygon-network-provider';

export class NetworkProviderService {

    private readonly ethNetworkProvider: EthNetworkProvider;
    private readonly polygonNetworkProvider: PolygonNetworkProvider;
    private readonly arbitrumNetworkProvider: ArbitrumNetworkProvider;

    public static readonly ARBITRUM_CHAIN_ID = '42161';
    public static readonly ETHEREUM_MAINNET_CHAIN_ID = '1';
    public static readonly POLYGON_MAINNET_CHAIN_ID = '137';
    private static readonly SUPPORTED_CHAIN_IDS = [this.ETHEREUM_MAINNET_CHAIN_ID, this.ARBITRUM_CHAIN_ID, this.POLYGON_MAINNET_CHAIN_ID];


    constructor({ethNetworkProvider, arbitrumNetworkProvider, polygonNetworkProvider}: {
        ethNetworkProvider: EthNetworkProvider,
        arbitrumNetworkProvider: ArbitrumNetworkProvider
        polygonNetworkProvider: PolygonNetworkProvider
    }) {
        this.ethNetworkProvider = ethNetworkProvider;
        this.arbitrumNetworkProvider = arbitrumNetworkProvider;
        this.polygonNetworkProvider = polygonNetworkProvider;
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
            default:
                throw new Error(`Unsupported chainId: ${chainId}. There is no provider for this chain yet!`);
        }
    }

}