import { AutoMap } from '@automapper/classes';
import { ClientDao } from '../../../domain/model/dao/client-dao';

export class DaoDto {

    @AutoMap(() => ClientDao)
    clientDao: ClientDao;

    @AutoMap()
    signature: string;

    @AutoMap()
    ipfsHash: string;

    constructor(clientDao: ClientDao, signature: string, ipfsHash: string) {
        this.clientDao = clientDao;
        this.signature = signature;
        this.ipfsHash = ipfsHash;
    }
}