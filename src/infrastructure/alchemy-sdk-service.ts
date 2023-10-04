import { Alchemy, Network } from 'alchemy-sdk';
import { getProperty } from '../application/env-var/env-var-service';
import {
    ARBITRUM_CHAIN_ID,
    DEVELOPMENT_NETWORK_CHAIN_ID,
    ETHEREUM_MAINNET_CHAIN_ID,
    POLYGON_MAINNET_CHAIN_ID
} from '../application/app-constants';

export class AlchemySdkService {

    public readonly ALCHEMY: Alchemy;

    constructor(chainId: string) {
        let network: Network;
        let apiKey: string;
        switch (chainId) {
            case ETHEREUM_MAINNET_CHAIN_ID:
                network = Network.ETH_MAINNET;
                apiKey = getProperty('ALCHEMY_POLYGON_API_KEY');
                break;
            case POLYGON_MAINNET_CHAIN_ID:
                network = Network.MATIC_MAINNET;
                apiKey = getProperty('ALCHEMY_POLYGON_API_KEY');
                break;
            case ARBITRUM_CHAIN_ID:
                network = Network.ARB_MAINNET;
                apiKey = getProperty('ALCHEMY_POLYGON_API_KEY');
                break;
                //todo fix it in future
            case DEVELOPMENT_NETWORK_CHAIN_ID:
                network = Network.ETH_MAINNET;
                apiKey = getProperty('ALCHEMY_POLYGON_API_KEY');
                break;
            default:
                throw new Error(`Cannot get network name! Unsupported chainId: ${chainId}`);
        }
        this.ALCHEMY = new Alchemy({
            apiKey,
            network
        });
    }
}