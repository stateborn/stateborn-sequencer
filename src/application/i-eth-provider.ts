import { JsonRpcProvider, Signer } from 'ethers';

export interface IEthProvider {
    getProvider(): JsonRpcProvider;
    getSigner(): Signer;
}