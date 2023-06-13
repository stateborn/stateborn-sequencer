import { CreateDaoDto } from '../../interfaces/dto/dao/create-dao-dto';
import { SignatureService } from '../../domain/service/signature-service';
import { IpfsDao } from '../../domain/model/dao/ipfs-dao';
import { IDbDaoRepository } from '../../domain/repository/i-db-dao-repository';
import { DaoToken } from '../../domain/model/dao/dao-token';
import { TokenDataService } from './token-data-service';
import { IIpfsRepository } from '../../domain/repository/i-ipfs-repository';
import { LOGGER } from '../../infrastructure/pino-logger-service';

export class CreateDaoService {

    private readonly ipfsRepository: IIpfsRepository;
    private readonly dbDaoRepository: IDbDaoRepository;
    private readonly signatureService: SignatureService;
    private readonly tokenDataService: TokenDataService;
    constructor({ipfsRepository, dbDaoRepository, signatureService, tokenDataService }:
                    { ipfsRepository: IIpfsRepository, dbDaoRepository: IDbDaoRepository, signatureService: SignatureService, tokenDataService: TokenDataService }) {
        this.ipfsRepository = ipfsRepository;
        this.dbDaoRepository = dbDaoRepository;
        this.signatureService = signatureService;
        this.tokenDataService = tokenDataService;
    }

    public async createDao(createDaoDto: CreateDaoDto): Promise<void> {
        const signatureValid = this.signatureService.isDaoValid(createDaoDto.clientDao, createDaoDto.signature, createDaoDto.creatorAddress);
        if (signatureValid) {
            const token: DaoToken | undefined = await this.tokenDataService.readTokenData(createDaoDto.clientDao.token.address);
            if (token) {
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
                throw new Error(`Creating dao failed. Token ${createDaoDto.clientDao.token.address} not found in the blockchain network.`);
            }
        } else {
            throw new Error(`Creating dao failed. Client signature is not valid.`);
        }
    }
}