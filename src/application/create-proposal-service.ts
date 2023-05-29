import { CreateProposalDto } from '../interfaces/dto/create-proposal-dto';
import { IMapperService } from '../domain/service/i-mapper-service';
import { IIpfsProposalRepository } from '../domain/repository/i-ipfs-proposal-repository';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { SignatureService } from '../domain/service/signature-service';
import { IDbSequencerRepository } from '../domain/repository/i-db-sequencer-repository';
import { LOGGER } from '../infrastructure/pino-logger-service';

export class CreateProposalService {

    private readonly ipfsRepository: IIpfsProposalRepository;
    private readonly dbProposalRepository: IDbProposalRepository;
    private readonly dbSequencerRepository: IDbSequencerRepository;
    private readonly mapperService: IMapperService;
    private readonly signatureService: SignatureService;
    constructor({ipfsRepository, dbProposalRepository, dbSequencerRepository, mapperService, signatureService }:
                    { ipfsRepository: IIpfsProposalRepository, dbProposalRepository: IDbProposalRepository, dbSequencerRepository: IDbSequencerRepository,
                        mapperService: IMapperService, signatureService: SignatureService }) {
        this.ipfsRepository = ipfsRepository;
        this.dbProposalRepository = dbProposalRepository;
        this.dbSequencerRepository = dbSequencerRepository;
        this.mapperService = mapperService;
        this.signatureService = signatureService;
    }

    public async createProposal(createProposalDto: CreateProposalDto): Promise<void> {
        const signatureValid = this.signatureService.isProposalValid(createProposalDto.getProposal(), createProposalDto.getSequencerSignature());
        if (signatureValid) {
            const ipfsProposal = this.mapperService.toIpfsProposal(createProposalDto);
            await this.dbSequencerRepository.findOrCreateSequencer(createProposalDto.getProposal().getSequencerAddress());
            const ipfsHash = await this.ipfsRepository.saveProposal(ipfsProposal);
            LOGGER.info(`Proposal saved to IPFS: ${ipfsHash})`);
            await this.dbProposalRepository.saveProposal(ipfsProposal, ipfsHash);
            LOGGER.info(`Proposal saved ${ipfsHash} to db`);
        } else {
            throw new Error(`Creating proposal failed. Proposal client signature is not valid.`);
        }
    }
}