import { ethers, Network, Signer } from 'ethers';
import { IEthProvider } from '../application/i-eth-provider';
import { NetworkProviderService } from './network-provider-service';
import { getProperty } from '../application/env-var/env-var-service';

export class ArbitrumNetworkProvider implements IEthProvider {

    private provider = new ethers.JsonRpcProvider(getProperty('ARBITRUM_NODE_RPC_URL'), Network.from(Number(NetworkProviderService.ARBITRUM_CHAIN_ID)));

    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

    getSigner(): Signer {
        throw new Error('Not implemented yet');
    }
}