import { asClass, Lifetime, createContainer, InjectionMode } from 'awilix';
import { DbRepository } from '../orm/db-repository';
import { IpfsRepository } from '../ipfs/ipfs-repository';
import { CreateProposalService } from '../../application/create-proposal-service';
import { SignatureService } from '../../domain/service/signature-service';
import { AutomapperService } from '../mapper/automapper-service';
import { MapperService } from '../../application/mapper/mapper-service';
import { CreateVoteService } from '../../application/create-vote-service';
import { ProposalResultService } from '../../application/proposal-result-service';
import { ProposalReportService } from '../../application/proposal-report-service';
import { MerkleTreeService } from '../../application/merkle-tree-service';
import { GetProposalService } from '../../application/get-proposal-service';
import { CreateDaoService } from '../../application/dao/create-dao-service';
import { EthNetworkProvider } from '../eth-network-provider';
import { TokenDataService } from '../../application/dao/token-data-service';
import { ArbitrumNetworkProvider } from '../arbitrum-network-provider';
import { NetworkProviderService } from '../network-provider-service';
import { PolygonNetworkProvider } from '../polygon-network-provider';
import { LocalhostNetworkProvider } from '../localhost-network-provider';

export const DI_CONTAINER = createContainer({
    injectionMode: InjectionMode.PROXY
});

export const initializeAwilixDI = () => {
    DI_CONTAINER.register({
        automapperService: asClass(AutomapperService, {
            lifetime: Lifetime.SINGLETON,
        }),
        mapperService: asClass(MapperService, {
            lifetime: Lifetime.SINGLETON,
        }),
        ipfsRepository: asClass(IpfsRepository, {
            lifetime: Lifetime.SINGLETON,
        }),
        dbProposalRepository: asClass(DbRepository, {
            lifetime: Lifetime.SINGLETON,
        }),
        dbSequencerRepository: asClass(DbRepository, {
            lifetime: Lifetime.SINGLETON,
        }),
        dbUserRepository: asClass(DbRepository, {
            lifetime: Lifetime.SINGLETON,
        }),
        dbVoteRepository: asClass(DbRepository, {
            lifetime: Lifetime.SINGLETON,
        }),
        createProposalService: asClass(CreateProposalService, {
            lifetime: Lifetime.SINGLETON,
        }),
        signatureService: asClass(SignatureService, {
            lifetime: Lifetime.SINGLETON,
        }),
        createVoteService: asClass(CreateVoteService, {
            lifetime: Lifetime.SINGLETON,
        }),
        proposalResultService: asClass(ProposalResultService, {
            lifetime: Lifetime.SINGLETON,
        }),
        // NOT A SINGLETON, IT'S STATEFUL SERVICE
        merkleTreeService: asClass(MerkleTreeService, {
            lifetime: Lifetime.TRANSIENT,
        }),
        proposalReportService: asClass(ProposalReportService, {
            lifetime: Lifetime.SINGLETON,
        }),
        getProposalService: asClass(GetProposalService, {
            lifetime: Lifetime.SINGLETON,
        }),
        createDaoService: asClass(CreateDaoService, {
            lifetime: Lifetime.SINGLETON,
        }),
        dbDaoRepository: asClass(DbRepository, {
            lifetime: Lifetime.SINGLETON,
        }),
        ethNetworkProvider: asClass(EthNetworkProvider, {
            lifetime: Lifetime.SINGLETON,
        }),
        polygonNetworkProvider: asClass(PolygonNetworkProvider, {
            lifetime: Lifetime.SINGLETON,
        }),
        arbitrumNetworkProvider: asClass(ArbitrumNetworkProvider, {
            lifetime: Lifetime.SINGLETON,
        }),
        localhostNetworkProvider: asClass(LocalhostNetworkProvider, {
            lifetime: Lifetime.SINGLETON,
        }),
        networkProviderService: asClass(NetworkProviderService, {
            lifetime: Lifetime.SINGLETON,
        }),
        tokenDataService: asClass(TokenDataService, {
            lifetime: Lifetime.SINGLETON,
        })
    });
};
