import { AutoMap } from '@automapper/classes';
import { ClientDaoDto } from './client-dao-dto';

export class DaoDto {

    @AutoMap(() => ClientDaoDto)
    clientDao: ClientDaoDto;

    @AutoMap()
    signature: string;

    @AutoMap()
    ipfsHash: string;

    constructor(clientDao: ClientDaoDto, signature: string, ipfsHash: string) {
        this.clientDao = clientDao;
        this.signature = signature;
        this.ipfsHash = ipfsHash;
    }
}