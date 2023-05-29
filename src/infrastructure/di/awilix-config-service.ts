import { asClass, Lifetime, createContainer, InjectionMode } from 'awilix';
import { DbRepository } from '../orm/db-repository';
import { IpfsRepository } from '../ipfs/ipfs-repository';
import { CreateProposalService } from '../../application/create-proposal-service';
import { SignatureService } from '../../domain/service/signature-service';
import { AutomapperService } from '../mapper/automapper-service';
import { MapperService } from '../../application/mapper/mapper-service';
import { CreateVoteService } from '../../application/create-vote-service';

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
    });
};
