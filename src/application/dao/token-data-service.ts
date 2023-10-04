import { ethers, InterfaceAbi } from 'ethers';
import { Token } from '../../domain/model/dao/token';
import { TokenType } from '../../domain/model/dao/token-type';
import { NetworkProviderService } from '../../infrastructure/network-provider-service';

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
        'function ownerOf(uint256 _tokenId) external view returns (address)'
    ];

    private networkProviderService: NetworkProviderService;


    constructor({networkProviderService}: { networkProviderService: NetworkProviderService }) {
        this.networkProviderService = networkProviderService;
    }

    async getBalanceOfAddressAtBlock(tokenAddress: string, tokenDecimals: number, userAddress: string, block: number, chainId: string): Promise<string> {
        const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
        // @ts-ignore
        const res = await contract.balanceOf(userAddress, {blockTag: block});
        //todo check if this is correct, maybe tokens can be fractional
        return Number(ethers.formatUnits(res, tokenDecimals)).toFixed(0);
    }

    async getOwnerOfNft(tokenAddress: string, chainId: string, tokenId: number): Promise<string> {
        const contract = new ethers.Contract(tokenAddress, this.ERC_721_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
        return await contract.ownerOf(tokenId);
    }

    async getBalanceOfAddress(tokenAddress: string, tokenDecimals: number, userAddress: string, chainId: string): Promise<string> {
        const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
        // @ts-ignore
        const res = await contract.balanceOf(userAddress);
        //todo check if this is correct, maybe tokens can be fractional
        return Number(ethers.formatUnits(res, tokenDecimals)).toFixed(0);
    }

    async getBlockNumber(chainId: string): Promise<number> {
        return await this.networkProviderService.getNetworkProvider(chainId).getProvider().getBlockNumber();
    }

    async readTokenData(tokenAddress: string, chainId: string): Promise<Token | undefined> {
        try {
            const {nameRes, symbolRes, decimalsRes } = await this.readNftTokenData(tokenAddress, chainId);
            return new Token(tokenAddress, nameRes, symbolRes, TokenType.NFT, chainId, decimalsRes);
        } catch (err) {
            try {
                const contract = new ethers.Contract(tokenAddress, this.ERC_20_ABI, this.networkProviderService.getNetworkProvider(chainId).getProvider());
                const nameRes = await contract.name();
                const symbolRes = await contract.symbol();
                const decimalsRes = (await contract.decimals()).toString();
                console.log(`Token ${tokenAddress} data : ${nameRes} ${symbolRes} ${decimalsRes}`);
                return new Token(tokenAddress, nameRes, symbolRes, TokenType.ERC20, chainId, Number(decimalsRes));
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