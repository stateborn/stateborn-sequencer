import { CreateDaoDto } from '../../interfaces/dto/dao/create-dao-dto';
import { SignatureService } from '../../domain/service/signature-service';
import { IpfsDao } from '../../domain/model/dao/ipfs-dao';
import { IDbDaoRepository } from '../../domain/repository/i-db-dao-repository';
import { DaoToken } from '../../domain/model/dao/dao-token';
import { TokenDataService } from './token-data-service';
import { IIpfsRepository } from '../../domain/repository/i-ipfs-repository';
import { LOGGER } from '../../infrastructure/pino-logger-service';
import { NetworkProviderService } from '../../infrastructure/network-provider-service';
import { ClientDaoToken } from '../../domain/model/dao/client-dao-token';
import dayjs from 'dayjs';
import { isDateAAfterB, isDateCreatedInLast5minutes } from '../date-service';

export class CreateDaoService {

    private readonly ipfsRepository: IIpfsRepository;
    private readonly dbDaoRepository: IDbDaoRepository;
    private readonly signatureService: SignatureService;
    private readonly tokenDataService: TokenDataService;
    private readonly networkProviderService: NetworkProviderService;

    constructor({ipfsRepository, dbDaoRepository, signatureService, tokenDataService, networkProviderService}:
                    {
                        ipfsRepository: IIpfsRepository,
                        dbDaoRepository: IDbDaoRepository,
                        signatureService: SignatureService,
                        tokenDataService: TokenDataService,
                        networkProviderService: NetworkProviderService
                    }) {
        this.ipfsRepository = ipfsRepository;
        this.dbDaoRepository = dbDaoRepository;
        this.signatureService = signatureService;
        this.tokenDataService = tokenDataService;
        this.networkProviderService = networkProviderService;
    }

    public async createDao(createDaoDto: CreateDaoDto): Promise<void> {
        const signatureValid = this.signatureService.isDaoValid(createDaoDto.clientDao, createDaoDto.signature, createDaoDto.creatorAddress);
        if (signatureValid) {
            if (this.networkProviderService.isSupportedChainId(createDaoDto.clientDao.token.chainId)) {
                const token: DaoToken | undefined = await this.tokenDataService.readTokenData(createDaoDto.clientDao.token.address, createDaoDto.clientDao.token.chainId);
                if (token) {
                    const clientTokenMatchesReadToken = this.doesClientTokenDataMatchReadTokenData(createDaoDto.clientDao.token, token);
                    if (clientTokenMatchesReadToken) {
                        this.validateRestOfPropertiesAndThrowErrorIfNeeded(createDaoDto);
                        // just to persist
                        const savedDaoToken = await this.dbDaoRepository.findOrCreateDaoToken(token);
                        const ipfsDao = new IpfsDao(
                            createDaoDto.clientDao,
                            createDaoDto.signature
                        );
                        const ipfsHash = await this.ipfsRepository.saveDao(ipfsDao);
                        LOGGER.info(`DAO ${createDaoDto.clientDao.name} saved to IPFS: ${ipfsHash})`);
                        await this.dbDaoRepository.saveDao(ipfsDao, savedDaoToken.id!, ipfsHash);
                        LOGGER.info(`DAO ${createDaoDto.clientDao.name} saved ${ipfsHash} to db`);
                    } else {
                        throw new Error(`Creating dao failed. Read token ${createDaoDto.clientDao.token.address} data don't match data  provided by the client. 
                        Client token data: ${JSON.stringify(createDaoDto.clientDao.token)}. Read token data: ${JSON.stringify(token)}.`);
                    }
                } else {
                    throw new Error(`Creating dao failed. Token ${createDaoDto.clientDao.token.address} not found in the ${this.networkProviderService.getNetworkName(createDaoDto.clientDao.token.chainId)} blockchain network.`);
                }
            } else {
                throw new Error(`Creating dao failed. Chain ID ${createDaoDto.clientDao.token.chainId} is not supported.`);
            }
        } else {
            throw new Error(`Creating dao failed. Client signature is not valid.`);
        }
    }

    private doesClientTokenDataMatchReadTokenData = (clientDaoToken: ClientDaoToken, daoToken: DaoToken) => {
        // chainId is verified by reading token from network
        return clientDaoToken.address === daoToken.address
            && clientDaoToken.name === daoToken.name
            && clientDaoToken.symbol === daoToken.symbol
            // token supply can...
            && (daoToken.totalSupply !== undefined ? (Number(clientDaoToken.totalSupply) <= daoToken.totalSupply) : true)
            && clientDaoToken.type === daoToken.type;
    }

    private validateRestOfPropertiesAndThrowErrorIfNeeded = (createDaoDto: CreateDaoDto) => {
        // todo change when supporting more than 1 threshold
        const thresholdIsCorrect = createDaoDto.clientDao.ownersMultisigThreshold === '1';
        // todo change when supporting more than 1 owner
        const ownersLengthCorrect = createDaoDto.clientDao.owners.length === 1
        const ownerAddressCorrect = createDaoDto.clientDao.owners[0] === createDaoDto.creatorAddress;
        const proposalTokenRequiredQuantityCorrect = Number.isInteger(Number(createDaoDto.clientDao.proposalTokenRequiredQuantity));
        const creationDateIsCorrect = isDateCreatedInLast5minutes(createDaoDto.clientDao.creationDateUtc);
        if (!thresholdIsCorrect) {
            throw new Error(`Creating dao failed. Owners multisig threshold ${createDaoDto.clientDao.ownersMultisigThreshold} is not supported.`);
        }
        if (!ownersLengthCorrect) {
            throw new Error(`Creating dao failed. Owners length ${createDaoDto.clientDao.owners.length} must be 1.`);
        }
        if (!ownerAddressCorrect) {
            throw new Error(`Creating dao failed. Owner address ${createDaoDto.clientDao.owners[0]} should be ${createDaoDto.creatorAddress}.`);
        }
        if (!proposalTokenRequiredQuantityCorrect) {
            throw new Error(`Creating dao failed. Proposal token required quantity ${createDaoDto.clientDao.proposalTokenRequiredQuantity} must be integer.`);
        }
        if (!creationDateIsCorrect) {
            throw new Error(`Creating dao failed. Dao creation date must be correct date in last 5 minutes. Provided date: ${createDaoDto.clientDao.creationDateUtc}`);
        }
    }

}