import { ethers, Network, Signer } from 'ethers';
import { getProperty } from '../application/env-var/env-var-service';
import { IEthProvider } from '../application/i-eth-provider';
import { NetworkProviderService } from './network-provider-service';
import { ETHEREUM_MAINNET_CHAIN_ID } from '../application/app-constants';

export class EthNetworkProvider implements IEthProvider {

    private provider = new ethers.JsonRpcProvider(getProperty('ETHEREUM_NODE_RPC_URL'), Network.from(Number(ETHEREUM_MAINNET_CHAIN_ID)));

    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

    getSigner(): Signer {
        throw new Error('Not implemented yet');
    }

}