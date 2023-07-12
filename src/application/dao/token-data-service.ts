import { ethers, InterfaceAbi } from 'ethers';
import { DaoToken } from '../../domain/model/dao/dao-token';
import { DaoTokenType } from '../../domain/model/dao/dao-token-type';
import { NetworkProviderService } from '../../infrastructure/network-provider-service';
import { getBooleanProperty, getProperty } from '../env-var/env-var-service';

const {Alchemy, Network, Utils} = require("alchemy-sdk");

export class TokenDataService {

    private readonly ERC_20_ABI: InterfaceAbi = [
        // Some details about the token
        'function name() view returns (string)',
        'function symbol() view returns (string)',

        // Get the account balance
        'function balanceOf(address) view returns (uint)',
        'function decimals() public view returns (uint8)',

        // Some details about the token supply
        'function totalSupply() view returns (uint256)',
    ];

    private readonly ERC_721_ABI: InterfaceAbi = [
        // Some details about the token
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function tokenURI(uint256 tokenId) view returns (string)',
        'function balanceOf(address) view returns (uint)',
        // OPTIONAL mostly likely not implemented
        'function decimals() public view returns (uint8)',
    ];

    private networkProviderService: NetworkProviderService;


    constructor({networkProviderService}: { networkProviderService: NetworkProviderService }) {
        this.networkProviderService = networkProviderService;
    }

    async getBalanceOfAddressAtBlock(tokenAddress: string, tokenDecimals: number, userAddress: string, block: number, chainId: string): Promise<string> {
        const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
        // @ts-ignore
        const res = await contract.balanceOf(userAddress, {blockTag: block});
        return ethers.formatUnits(res, tokenDecimals);
    }

    async getBlockNumber(chainId: string): Promise<number> {
        return await this.networkProviderService.getNetworkProvider(chainId).getProvider().getBlockNumber();
    }

    async readTokenData(tokenAddress: string, chainId: string): Promise<DaoToken | undefined> {
        try {
            const {nameRes, symbolRes, decimalsRes } = await this.readNftTokenData(tokenAddress, chainId);
            return new DaoToken(tokenAddress, nameRes, symbolRes, DaoTokenType.NFT, chainId, decimalsRes);
        } catch (err) {
            try {
                const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
                const nameRes = await contract.name();
                const symbolRes = await contract.symbol();
                const decimalsRes = (await contract.decimals()).toString();
                console.log(`Token ${tokenAddress} data : ${nameRes} ${symbolRes} ${decimalsRes}`);
                return new DaoToken(tokenAddress, nameRes, symbolRes, DaoTokenType.ERC20, chainId, Number(decimalsRes));
            } catch (err2) {
                console.log(`Error reading token ${tokenAddress} data`, err2);
                return undefined;
            }
        }
    }

    private async readNftTokenData(tokenAddress: string, chainId: string): Promise<any> {
        try {
            const contract = new ethers.Contract(tokenAddress, this.ERC_721_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
            const nameRes = await contract.name();
            const symbolRes = await contract.symbol();
            await contract.tokenURI(1);
            let decimalsRes = '0';
            try {
                decimalsRes = (await contract.decimals()).toString();
            } catch (err) {
                //ignore probably will be thrown
            }
            console.log(`Token ${tokenAddress} data : ${nameRes} ${symbolRes} {decimalsRes}`);
            return {nameRes, symbolRes, decimalsRes };
        } catch (err) {
            console.log(`Error reading token ${tokenAddress} data`, err);
            throw new Error(`Error reading token ${tokenAddress} data`);
        }
    }


}