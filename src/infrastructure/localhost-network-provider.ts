import { ethers } from 'ethers';
import { getProperty } from '../application/env-var/env-var-service';
import { IEthProvider } from '../application/i-eth-provider';

export class LocalhostNetworkProvider implements IEthProvider {

    private provider = new ethers.JsonRpcProvider(getProperty('DEVELOPMENT_NETWORK_RPC'));

    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

}