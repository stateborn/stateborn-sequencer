import { ethers, Network, Signer } from 'ethers';
import { IEthProvider } from '../application/i-eth-provider';
import { getProperty } from '../application/env-var/env-var-service';
import { ARBITRUM_CHAIN_ID } from '../application/app-constants';

export class ArbitrumNetworkProvider implements IEthProvider {

    private provider = new ethers.JsonRpcProvider(getProperty('ARBITRUM_NODE_RPC_URL'), Network.from(Number(ARBITRUM_CHAIN_ID)));

    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

    getSigner(): Signer {
        throw new Error('Not implemented yet');
    }
}