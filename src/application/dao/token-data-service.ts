import { ethers, InterfaceAbi } from 'ethers';
import { DaoToken } from '../../domain/model/dao/dao-token';
import { DaoTokenType } from '../../domain/model/dao/dao-token-type';
import { NetworkProviderService } from '../../infrastructure/network-provider-service';

const {Alchemy, Network, Utils} = require("alchemy-sdk");

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

    private networkProviderService: NetworkProviderService;


    constructor({networkProviderService}: { networkProviderService: NetworkProviderService }) {
        this.networkProviderService = networkProviderService;
    }

    async getBalanceOfAddressAtBlock(tokenAddress: string, userAddress: string, block: number, chainId: string): Promise<string> {
        try {
            const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
            // @ts-ignore
            const res = await contract.balanceOf(userAddress, {blockTag: block});
            const res2 = ethers.formatUnits(res, 18);
            return res2;
        } catch (err) {
            throw err;
        }
    }

    // async getBalanceOfAddressAtBlock(tokenAddress: string, userAddress: string, block: number): Promise<string> {
    //     const config = {
    //         apiKey: getProperty('ALCHEMY_API_KEY'),
    //         network: Network.ETH_MAINNET,
    //     };
    //     const alchemy = new Alchemy(config);
    //     try {
    //         // Get latest USDT balance
    //         const blockNum = 17477756;
    //
    //         // Create function call data -- eth_call
    //         let iface = new ethers.Interface(this.ERC_20_ABI)
    //         let data = iface.encodeFunctionData("balanceOf", ['0x3bDC69C4E5e13E52A65f5583c23EFB9636b469d6']);
    //
    //         // Get balance at a particular block -- usage of eth_call
    //         let balance = await alchemy.core.call({
    //             to: tokenAddress,
    //             data: data,
    //         }, blockNum);
    //
    //         console.log("Balance:", parseInt(balance));
    //         const balance2 = ethers.formatUnits(balance, 18);
    //         return balance2;
    //     } catch (err) {
    //         throw err;
    //     }
    // }


    async readTokenData(tokenAddress: string, chainId: string): Promise<DaoToken | undefined> {
        try {
            const {nameRes, symbolRes} = await this.readNftTokenData(tokenAddress, chainId);
            return new DaoToken(tokenAddress, nameRes, symbolRes, DaoTokenType.NFT, chainId);
        } catch (err) {
            try {
                const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
                const nameRes = await contract.name();
                const symbolRes = await contract.symbol();
                // big int
                const supplyRes = (await contract.totalSupply()).toString();
                console.log(`Token ${tokenAddress} data : ${nameRes} ${symbolRes} ${supplyRes}`);
                return new DaoToken(tokenAddress, nameRes, symbolRes, DaoTokenType.ERC20, chainId, Number(supplyRes));
            } catch (err) {
                console.log(`Error reading token ${tokenAddress} data`, err);
                return undefined;
            }
        }
    }

    private async readNftTokenData(tokenAddress: string, chainId: string): Promise<any> {
        try {
            const contract = new ethers.Contract(tokenAddress, this.ERC_721_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
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