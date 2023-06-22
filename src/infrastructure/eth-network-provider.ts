import { ethers } from 'ethers';
import { getProperty } from '../application/env-var/env-var-service';
import { IEthProvider } from '../application/i-eth-provider';

export class EthNetworkProvider implements IEthProvider {

    private provider = new ethers.AlchemyProvider('mainnet', getProperty('ALCHEMY_API_KEY'));

    getProvider(): ethers.AlchemyProvider {
        return this.provider;
    }

}