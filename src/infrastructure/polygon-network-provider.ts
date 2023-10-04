import { ethers, Network, Signer } from 'ethers';
import { getProperty } from '../application/env-var/env-var-service';
import { IEthProvider } from '../application/i-eth-provider';
import { POLYGON_MAINNET_CHAIN_ID } from '../application/app-constants';

export class PolygonNetworkProvider implements IEthProvider {

    private provider = new ethers.JsonRpcProvider(getProperty('POLYGON_NODE_RPC_URL'), Network.from(Number(POLYGON_MAINNET_CHAIN_ID)));

    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

    getSigner(): Signer {
        throw new Error('Not implemented yet');
    }

}