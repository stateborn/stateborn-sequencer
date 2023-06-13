import { ethers, InterfaceAbi } from 'ethers';
import { IEthProvider } from '../i-eth-provider';
import { DaoToken } from '../../domain/model/dao/dao-token';
import { DaoTokenType } from '../../domain/model/dao/dao-token-type';

export class TokenDataService {
    private readonly ERC_20_ABI: InterfaceAbi = [
        // Some details about the token
        'function name() view returns (string)',
        'function symbol() view returns (string)',

        // Get the account balance
        'function balanceOf(address) view returns (uint)',

        // Some details about the token supply
        'function totalSupply() view returns (uint256)',
    ];

    private readonly ERC_721_ABI: InterfaceAbi = [
        // Some details about the token
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function tokenURI(uint256 tokenId) view returns (string)',
    ];

    private ethProvider: IEthProvider;


    constructor({ethProvider}: { ethProvider: IEthProvider }) {
        this.ethProvider = ethProvider;
    }

    async readTokenData(tokenAddress: string): Promise<DaoToken | undefined> {
        try {
            const {nameRes, symbolRes} = await this.readNftTokenData(tokenAddress);
            return new DaoToken(tokenAddress, nameRes, symbolRes, DaoTokenType.NFT, 'mainnet', undefined);
        } catch (err) {
            try {
                const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.ethProvider.getProvider());
                const nameRes = await contract.name();
                const symbolRes = await contract.symbol();
                const supplyRes = await contract.totalSupply();
                console.log(`Token ${tokenAddress} data : ${nameRes} ${symbolRes} ${supplyRes.toString()}`);
                return new DaoToken(tokenAddress, nameRes, symbolRes, DaoTokenType.ERC20, 'mainnet', {supply: supplyRes.toString()});
            } catch (err) {
                console.log(`Error reading token ${tokenAddress} data`, err);
                return undefined;
            }
        }
    }

    private async readNftTokenData(tokenAddress: string): Promise<any> {
        try {
            const contract = new ethers.Contract(tokenAddress, this.ERC_721_ABI, this.ethProvider.getProvider());
            const nameRes = await contract.name();
            const symbolRes = await contract.symbol();
            await contract.tokenURI(0);
            console.log(`Token ${tokenAddress} data : ${nameRes} ${symbolRes}`);
            return {nameRes, symbolRes};
        } catch (err) {
            console.log(`Error reading token ${tokenAddress} data`, err);
            throw new Error(`Error reading token ${tokenAddress} data`);
        }
    }


}