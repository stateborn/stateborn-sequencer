import { ethers, Network } from 'ethers';
import { getProperty } from '../application/env-var/env-var-service';
import { IEthProvider } from '../application/i-eth-provider';
import { NetworkProviderService } from './network-provider-service';

export class PolygonNetworkProvider implements IEthProvider {

    private provider = new ethers.JsonRpcProvider(getProperty('POLYGON_NODE_RPC_URL'), Network.from(Number(NetworkProviderService.POLYGON_MAINNET_CHAIN_ID)));

    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

}