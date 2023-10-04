import { AlchemySdkService } from '../alchemy-sdk-service';
import { OwnedNftsResponse, TokenBalancesResponseErc20 } from 'alchemy-sdk/dist/src/types/types';
import { IAssetsService } from '../../domain/service/assets/i-assets-service';
import { AssetData } from '../../domain/model/assets/asset-data';
import { TokenType } from '../../domain/model/dao/token-type';
import { ICacheAssetsBalancesRepository } from '../../domain/repository/i-cache-assets-balances-repository';
import { AssetBalance } from '../../domain/model/assets/asset-balance';
import { IDbAssetDataRepository } from '../../domain/repository/i-db-asset-data-repository';
import { Asset } from '../../domain/model/assets/asset';
import { TokenDataService } from '../../application/dao/token-data-service';
import { LOGGER } from '../pino-logger-service';
import { Nft } from '../../domain/model/assets/nft';
import { NftImageService } from './nft-image-service';
import { TokenBlacklist } from '../../domain/model/assets/token-blacklist';

const crypto = require('crypto');

export abstract class AlchemyAssetsService implements IAssetsService {

    private alchemySdkService: AlchemySdkService;
    private cacheAssetsBalancesRepository: ICacheAssetsBalancesRepository;
    private assetDataRepository: IDbAssetDataRepository;
    private tokenDataService: TokenDataService;
    private nftImageService: NftImageService;
    private chainId: string;

    constructor({alchemySdkService, cacheAssetsBalancesRepository, assetDataRepository, tokenDataService, nftImageService, chainId}: {
        alchemySdkService: AlchemySdkService,
        cacheAssetsBalancesRepository: ICacheAssetsBalancesRepository,
        assetDataRepository: IDbAssetDataRepository,
        tokenDataService: TokenDataService,
        nftImageService: NftImageService,
        chainId: string,
    }) {
        this.alchemySdkService = alchemySdkService;
        this.cacheAssetsBalancesRepository = cacheAssetsBalancesRepository;
        this.assetDataRepository = assetDataRepository;
        this.tokenDataService = tokenDataService;
        this.nftImageService = nftImageService;
        this.chainId = chainId;
    }

    async getAssets(ownerAddress: string): Promise<Asset[]> {
        const assetBalances: AssetBalance[] = this.cacheAssetsBalancesRepository.getBalances(ownerAddress, this.chainId);
        const assets: Asset[] = [];
        if (assetBalances.length > 0) {
            for (const assetBalance of assetBalances) {
                const isTokenBlacklisted = await this.assetDataRepository.isTokenBlacklist(new TokenBlacklist(assetBalance.assetAddress, this.chainId, assetBalance.tokenType));
                if (!isTokenBlacklisted) {
                    const assetData = await this.assetDataRepository.readAssetData(assetBalance.assetAddress, this.chainId, assetBalance.nftId);
                    assets.push(new Asset(assetData!, assetBalance.balance));
                }
            }
        } else {
            const tokensBlacklist: TokenBlacklist[] = [];
            const assetDataToSave: AssetData[] = [];
            const {assets: erc20Assets, tokensBlacklist: erc20TokensBlacklist, assetDataToSave: erc20AssetDataToSave } = await this.getErc20Assets(ownerAddress);
            assets.push(...erc20Assets);
            tokensBlacklist.push(...erc20TokensBlacklist);
            assetDataToSave.push(...erc20AssetDataToSave);
            const {assets: nftAssets, tokensBlacklist: nftTokensBlacklist, assetDataToSave: nftAssetDataToSave } = await this.getNftAssets(ownerAddress);
            assets.push(...nftAssets);
            tokensBlacklist.push(...nftTokensBlacklist);
            assetDataToSave.push(...nftAssetDataToSave);
            await this.assetDataRepository.saveTokenBlacklist(tokensBlacklist);
            await this.assetDataRepository.saveAssetsData(assetDataToSave);
            const assetBalances: AssetBalance[] = assets.map(_ => new AssetBalance(_.assetData.token.address, _.assetBalance, _.assetData.token.type, _.assetData.nft?.nftTokenId));
            this.cacheAssetsBalancesRepository.saveBalances(ownerAddress, this.chainId, assetBalances);
        }
        return assets;
    }

    private calculateSHA256(input: string) {
        const hash = crypto.createHash('sha256');
        hash.update(input);
        return hash.digest('hex');
    }

    private sortJsonKeys(json: any): any {
        const sortedJsonObject: any = {};
        Object.keys(json).sort().forEach(key => {
            sortedJsonObject[key] = json[key];
        });
        return sortedJsonObject;
    }

    async getErc20Assets(ownerAddress: string): Promise<{assets: Asset[], tokensBlacklist: TokenBlacklist[], assetDataToSave: AssetData[]}> {
        const assets: Asset[] = [];
        const assetDataToSave: AssetData[] = [];
        const tokensBlacklist: TokenBlacklist[] = [];
        const tokenBalancesResponseErc20: TokenBalancesResponseErc20 = await this.alchemySdkService.ALCHEMY.core.getTokenBalances(ownerAddress);
        for (const tokenBalance of tokenBalancesResponseErc20.tokenBalances) {
            let assetData: AssetData | undefined = await this.assetDataRepository.readAssetData(tokenBalance.contractAddress.toLowerCase(), this.chainId);
            if (!assetData) {
                const isTokenBlacklisted = await this.assetDataRepository.isTokenBlacklist(new TokenBlacklist(tokenBalance.contractAddress.toLowerCase(), this.chainId, TokenType.ERC20));
                if (!isTokenBlacklisted) {
                    const token = await this.tokenDataService.readTokenData(tokenBalance.contractAddress.toLowerCase(), this.chainId);
                    if (token) {
                        assetData = new AssetData(token);
                        assetDataToSave.push(assetData)
                    } else {
                        tokensBlacklist.push(new TokenBlacklist(
                            tokenBalance.contractAddress.toLowerCase(),
                            this.chainId,
                            TokenType.ERC20,
                        ));
                        LOGGER.warn(`Token data could not be read for address ${tokenBalance.contractAddress.toLowerCase()}. Adding to blacklist.`);
                    }
                } else {
                    LOGGER.debug(`Token ${tokenBalance.contractAddress.toLowerCase()} is blacklisted. Skipping reading it.`);
                }
            }
            if (assetData) {
                //balance must be multiplied by tokens decimals
                const balance = Number(tokenBalance.tokenBalance);
                if (balance > 0) {
                    assets.push(new Asset(assetData, Number(tokenBalance.tokenBalance)));
                }
            }
        }
        return {
            assets,
            tokensBlacklist,
            assetDataToSave,
        };
    }

    async getNftAssets(ownerAddress: string): Promise<{assets: Asset[], tokensBlacklist: TokenBlacklist[], assetDataToSave: AssetData[]}> {
        const assets: Asset[] = [];
        const assetDataToSave: AssetData[] = [];
        const tokensBlacklist: TokenBlacklist[] = [];
        const ownedNftsResponse: OwnedNftsResponse = await this.alchemySdkService.ALCHEMY.nft.getNftsForOwner(ownerAddress);
        for (const ownedNft of ownedNftsResponse.ownedNfts) {
            let assetData: AssetData | undefined = await this.assetDataRepository.readAssetData(ownedNft.contract.address.toLowerCase(), this.chainId, ownedNft.tokenId);
            if (!assetData) {
                const isTokenBlacklisted = await this.assetDataRepository.isTokenBlacklist(new TokenBlacklist(ownedNft.contract.address.toLowerCase(), this.chainId, TokenType.ERC20));
                if (!isTokenBlacklisted) {
                    const token = await this.tokenDataService.readTokenData(ownedNft.contract.address.toLowerCase(), this.chainId);
                    if (token) {
                        let imageBase64: string | undefined = undefined;
                        let thumbnailBase64: string | undefined = undefined;
                        if (ownedNft.media.length > 0) {
                            imageBase64 = await this.nftImageService.fetchImageToBase64(ownedNft.media[0].gateway);
                            if (ownedNft.media[0].thumbnail) {
                                thumbnailBase64 = await this.nftImageService.fetchImageToBase64(ownedNft.media[0].thumbnail);
                            }
                        }
                        assetData = new AssetData(
                            token,
                            new Nft(
                                ownedNft.tokenId,
                                ownedNft.rawMetadata?.name,
                                ownedNft.rawMetadata?.description,
                                ownedNft.tokenUri?.raw,
                                ownedNft.rawMetadata,
                                this.calculateSHA256(JSON.stringify(this.sortJsonKeys(ownedNft.rawMetadata))),
                                imageBase64,
                                thumbnailBase64,
                            )
                        );
                        assetDataToSave.push(assetData)
                    } else {
                        tokensBlacklist.push(new TokenBlacklist(
                            ownedNft.contract.address.toLowerCase(),
                            this.chainId,
                            TokenType.NFT,
                        ));
                        LOGGER.warn(`NFT token data not found for address ${ownedNft.contract.address.toLowerCase()}`);
                    }

                } else {
                    LOGGER.debug(`NFT token ${ownedNft.contract.address.toLowerCase()} is blacklisted. Skipping reading it.`)
                }
            }
            if (assetData) {
                //balance must be multiplied by tokens decimals
                assets.push(new Asset(assetData, ownedNft.balance));
            }
        }
        return {
            assets,
            tokensBlacklist,
            assetDataToSave,
        };
    }

}