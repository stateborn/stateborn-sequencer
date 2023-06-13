import { JsonRpcProvider } from 'ethers';

export interface IEthProvider {
    getProvider(): JsonRpcProvider;
}