import { CreateProposalDto } from '../interfaces/dto/create-proposal-dto';
import { IMapperService } from '../domain/service/i-mapper-service';
import { IIpfsRepository } from '../domain/repository/i-ipfs-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { SignatureService } from '../domain/service/signature-service';
import { LOGGER } from '../infrastructure/pino-logger-service';
import { TokenDataService } from './dao/token-data-service';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { Dao } from '../domain/model/dao/dao';
import { isDateCreatedInLastGivenMinutes, isDateInTheFuture, isUtcDateAEqualOrAfterB } from './date-service';
import { ProposalType } from '../domain/model/proposal/proposal-type';
import { ClientProposalTransaction } from '../domain/model/proposal/client-proposal-transaction';
import { BlockchainProposalTransactionType } from '../domain/model/proposal/blockchain-proposal-transaction-type';
import { TokenType } from '../domain/model/dao/token-type';
import { ProposalTransactionData } from '../domain/model/proposal/proposal-transaction/proposal-transaction-data';
import {
    TransferErc20TransactionData
} from '../domain/model/proposal/proposal-transaction/transfer-erc-20-transaction-data';
import {
    TransferNftTransactionData
} from '../domain/model/proposal/proposal-transaction/transfer-nft-transaction-data';
import { NetworkProviderService } from '../infrastructure/network-provider-service';
import {
    TransferCryptoTransactionData
} from '../domain/model/proposal/proposal-transaction/transfer-crypto-transaction-data';

export class CreateProposalService {

    private readonly ipfsRepository: IIpfsRepository;
    private readonly dbProposalRepository: IDbProposalRepository;
    private readonly dbDaoRepository: IDbDaoRepository;
    private readonly mapperService: IMapperService;
    private readonly signatureService: SignatureService;
    private readonly tokenDataService: TokenDataService;
    private readonly networkProviderService: NetworkProviderService;
    // Client provides block number based on which token balance is read
    // this block number cannot be lower than (latest block number) - BLOCKS_TOLERANCE
    public static readonly BLOCKS_TOLERANCE: number = 10;

    // TODO THIS MUST MATCH CLIENT VALUE
    public static MINIMUM_WEI_TO_SEND_IN_TRANSFER: bigint = BigInt(100000000);
    constructor({
                    ipfsRepository,
                    dbProposalRepository,
                    mapperService,
                    signatureService,
                    tokenDataService,
                    dbDaoRepository,
                    networkProviderService
                }:
                    {
                        ipfsRepository: IIpfsRepository,
                        dbProposalRepository: IDbProposalRepository,
                        mapperService: IMapperService,
                        signatureService: SignatureService,
                        dbDaoRepository: IDbDaoRepository,
                        tokenDataService: TokenDataService,
                        networkProviderService: NetworkProviderService,
                    }) {
        this.ipfsRepository = ipfsRepository;
        this.dbProposalRepository = dbProposalRepository;
        this.mapperService = mapperService;
        this.signatureService = signatureService;
        this.tokenDataService = tokenDataService;
        this.dbDaoRepository = dbDaoRepository;
        this.networkProviderService = networkProviderService;
    }

    public async createProposal(createProposalDto: CreateProposalDto): Promise<void> {
        const signatureValid = this.signatureService.isProposalValid(createProposalDto.clientProposal, createProposalDto.creatorSignature);
        if (signatureValid) {
            const dao: Dao | undefined = await this.dbDaoRepository.findDao(createProposalDto.clientProposal.daoIpfsHash);
            if (dao !== undefined) {
                await this.validateClientBlockNumberAndThrowErrorIfNeeded(createProposalDto.clientProposal.blockNumber, dao.ipfsDao.clientDao.token.chainId);
                const userTokenBalanceAtProposalBlock = await this.tokenDataService.getBalanceOfAddressAtBlock(
                    dao.ipfsDao.clientDao.token.address,
                    Number(dao.ipfsDao.clientDao.token.decimals),
                    createProposalDto.clientProposal.creatorAddress,
                    Number(createProposalDto.clientProposal.blockNumber),
                    dao.ipfsDao.clientDao.token.chainId);
                if (Number(userTokenBalanceAtProposalBlock) >= Number(dao.ipfsDao.clientDao.proposalTokenRequiredQuantity)) {
                    if (this.areProposalDatesCorrect(createProposalDto)) {
                        if (createProposalDto.clientProposal.proposalType === ProposalType.OPTIONS) {
                            const proposalOptions = (<any>createProposalDto.clientProposal.data)?.options;
                            if (!this.proposalOptionsAreCorrect(proposalOptions)) {
                                throw new Error(`Creating proposal failed. Proposal options are not correct: ${(<any>createProposalDto.clientProposal.data)?.options}`);
                            }
                        }
                        if (createProposalDto.clientProposal.proposalType === ProposalType.YES_NO) {
                            if (createProposalDto.clientProposal.data !== undefined) {
                                throw new Error(`Creating proposal failed. For proposal type ${createProposalDto.clientProposal.proposalType} data must be undefined!`);
                            }
                        }
                        if (createProposalDto.clientProposal.transactions) {
                            if (dao.ipfsDao.clientDao.contractAddress) {
                                await this.validateProposalTransactionsAndThrowErrorIfNeeded(createProposalDto.clientProposal.transactions, dao.ipfsDao.clientDao.contractAddress!, dao.ipfsDao.clientDao.token.chainId);
                            } else {
                                throw new Error(`Creating proposal failed. Proposal has transactions to execute but DAO ${dao.ipfsHash} is not on-chain DAO!`);
                            }
                        }
                        const ipfsProposal = this.mapperService.toIpfsProposal(createProposalDto);
                        const ipfsHash = await this.ipfsRepository.saveProposal(ipfsProposal);
                        LOGGER.info(`Proposal saved to IPFS: ${ipfsHash})`);
                        await this.dbProposalRepository.saveProposal(ipfsProposal, ipfsHash, dao.ipfsDao.clientDao.token.chainId);
                        LOGGER.info(`Proposal saved ${ipfsHash} to db`);
                    } else {
                        throw new Error(`Creating proposal failed. Proposal dates are not correct. Start date: ${createProposalDto.clientProposal.startDateUtc} 
                            End date: ${createProposalDto.clientProposal.endDateUtc}`);
                    }
                } else {
                    throw new Error(`Creating proposal failed. Proposal required tokens to have is ${dao.ipfsDao.clientDao.proposalTokenRequiredQuantity} but at block ${createProposalDto.clientProposal.blockNumber} user ${createProposalDto.clientProposal.creatorAddress} has ${userTokenBalanceAtProposalBlock}!`);
                }
            } else {
                throw new Error(`Creating proposal failed. DAO with ipfs hash ${createProposalDto.clientProposal.daoIpfsHash} not found!`);
            }
        } else {
            throw new Error(`Creating proposal failed. Proposal client signature is not valid.`);
        }
    }

    private async validateProposalTransactionsAndThrowErrorIfNeeded(proposalTransactions: ClientProposalTransaction[], daoContractAddress: string, daoContractAddressChainId: string): Promise<void> {
        for (const proposalTransaction of proposalTransactions) {
            if (proposalTransaction.transactionType === BlockchainProposalTransactionType.TRANSFER_ERC_20_TOKENS) {
                const tokenData: TransferErc20TransactionData = <TransferErc20TransactionData>proposalTransaction.data;
                const token = await this.tokenDataService.readTokenData(tokenData.token.address, daoContractAddressChainId);
                if (token === undefined) {
                    throw new Error(`Creating proposal failed. Proposal transaction ${TokenType.ERC20} token to transfer ${tokenData.token.address} is not found!`);
                }
                const decimals = token.decimals;
                const daoTokenBalance = await this.tokenDataService.getBalanceOfAddress(tokenData.token.address, decimals, daoContractAddress, daoContractAddressChainId);
                if (Number(daoTokenBalance) < Number(tokenData.transferAmount)) {
                    throw new Error(`Creating proposal failed. Transaction send amount it ${tokenData.transferAmount} ${token.symbol} but DAO owns ${daoTokenBalance} ${token.symbol}!`);
                }
                if (!Number.isInteger(Number(tokenData.transferAmount))) {
                    throw new Error(`Creating proposal failed. Transaction send amount ${tokenData.transferAmount} ${token.symbol} is not integer!`);
                }
                if (tokenData.transferToAddress.trim() === daoContractAddress) {
                    throw new Error(`Creating proposal failed. DAO cannot be transaction receiver (receiver has address ${tokenData.transferToAddress.trim()}!`);
                }
            } else if (proposalTransaction.transactionType === BlockchainProposalTransactionType.TRANSFER_NFT_TOKEN) {
                const tokenData: TransferNftTransactionData = <TransferNftTransactionData>proposalTransaction.data;
                const token = await this.tokenDataService.readTokenData(tokenData.token.address, daoContractAddressChainId);
                if (token === undefined) {
                    throw new Error(`Creating proposal failed. Proposal transaction ${TokenType.NFT} token to transfer ${tokenData.token.address} is not found!`);
                }
                const ownerOfNft = await this.tokenDataService.getOwnerOfNft(tokenData.token.address, daoContractAddressChainId, Number(tokenData.tokenId));
                if (ownerOfNft !== daoContractAddress) {
                    throw new Error(`Creating proposal failed. Proposal transaction NFT with address ${tokenData.token.address} id ${tokenData.tokenId} is not owned by DAO ${daoContractAddress}!`);
                }
                if (tokenData.transferToAddress.trim() === daoContractAddress) {
                    throw new Error(`Creating proposal failed. DAO cannot be transaction receiver (receiver has address ${tokenData.transferToAddress.trim()}!`);
                }
            } else if (proposalTransaction.transactionType === BlockchainProposalTransactionType.TRANSFER_CRYPTO) {
                const daoBalance: bigint = await this.networkProviderService.getNetworkProvider(daoContractAddressChainId).getProvider().getBalance(daoContractAddress);
                const tokenData: TransferCryptoTransactionData = <TransferCryptoTransactionData> proposalTransaction.data;
                let amountToSend: bigint;
                try {
                    amountToSend = BigInt(tokenData.amount);
                } catch (error) {
                    throw new Error(`Creating proposal failed. Crypto amount to save ${tokenData.amount} is not Integer (expected WEI integer)!`);
                }
                if (amountToSend <= BigInt(0)) {
                    throw new Error(`Creating proposal failed. Crypto amount to save ${tokenData.amount} is not positive!`);
                }
                if (amountToSend > daoBalance) {
                    throw new Error(`Creating proposal failed. DAO has not enough balance to send ${proposalTransaction.data} wei. DAO balance is ${daoBalance}!`);
                }
                if (amountToSend < CreateProposalService.MINIMUM_WEI_TO_SEND_IN_TRANSFER) {
                    throw new Error(`Creating proposal failed. Amount to send ${amountToSend} wei is below minimum amount ${CreateProposalService.MINIMUM_WEI_TO_SEND_IN_TRANSFER}!`);
                }
                if (tokenData.transferToAddress.trim() === daoContractAddress) {
                    throw new Error(`Creating proposal failed. DAO cannot be transaction receiver (receiver has address ${tokenData.transferToAddress.trim()}!`);
                }
            } else {
                throw new Error(`Creating proposal failed. Transaction of type ${proposalTransaction.transactionType} is not supported.`);
            }
        }
    }

    private async validateClientBlockNumberAndThrowErrorIfNeeded(clientBlockNumber: string, chainId: string): Promise<void> {
        const latestReadBlockNumber = await this.tokenDataService.getBlockNumber(chainId);
        if (latestReadBlockNumber < Number(clientBlockNumber)) {
            throw new Error(`Creating proposal failed. Client given block number ${clientBlockNumber} is below latest read block number ${latestReadBlockNumber}!`);
        }
        if (Number(clientBlockNumber) < (latestReadBlockNumber - CreateProposalService.BLOCKS_TOLERANCE)) {
            throw new Error(`Creating proposal failed. Client given block number ${clientBlockNumber} is below acceptance level (${latestReadBlockNumber} (latest block) - ${CreateProposalService.BLOCKS_TOLERANCE})!`);
        }
    }

    // proposalOptions is the array of string
    // string cannot be longer than 120 words
    private proposalOptionsAreCorrect(proposalOptions: any | undefined): boolean {
        return proposalOptions !== undefined && proposalOptions !== null && Array.isArray(proposalOptions) && proposalOptions.length > 0
        && proposalOptions.filter(_ => typeof _ === 'string' && _.length <= 120).length === proposalOptions.length;
    }

    private areProposalDatesCorrect(proposal: CreateProposalDto): boolean {
        const proposalStartDateCorrect = isDateCreatedInLastGivenMinutes(proposal.clientProposal.startDateUtc, 5);
        const proposalEndDateInFuture = isDateInTheFuture(proposal.clientProposal.endDateUtc);
        const areDatesCorrect = isUtcDateAEqualOrAfterB(proposal.clientProposal.endDateUtc, proposal.clientProposal.startDateUtc);
        return proposalStartDateCorrect && proposalEndDateInFuture && areDatesCorrect;
    }
}