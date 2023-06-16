import { ethers, InterfaceAbi } from 'ethers';
import { IEthProvider } from '../i-eth-provider';
import { DaoToken } from '../../domain/model/dao/dao-token';
import { DaoTokenType } from '../../domain/model/dao/dao-token-type';
import { getProperty } from '../env-var/env-var-service';
import { constructUsing } from '@automapper/core';

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

    private ethProvider: IEthProvider;


    constructor({ethProvider}: { ethProvider: IEthProvider }) {
        this.ethProvider = ethProvider;
    }

    async getBalanceOfAddressAtBlock(tokenAddress: string, userAddress: string, block: number): Promise<string> {
        try {
            const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.ethProvider.getProvider());
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