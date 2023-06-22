import { ethers } from 'ethers';
import { getProperty } from '../application/env-var/env-var-service';
import { IEthProvider } from '../application/i-eth-provider';

export class PolygonNetworkProvider implements IEthProvider {

    private provider = new ethers.AlchemyProvider(137, getProperty('ALCHEMY_POLYGON_API_KEY'));

    getProvider(): ethers.AlchemyProvider {
        return this.provider;
    }

}