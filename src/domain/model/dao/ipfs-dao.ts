import { AutoMap } from '@automapper/classes';
import { ClientDao } from './client-dao';

export class IpfsDao {

    @AutoMap(() => ClientDao)
    clientDao: ClientDao;

    @AutoMap()
    signature: string;

    constructor(clientDao: ClientDao, signature: string) {
        this.clientDao = clientDao;
        this.signature = signature;
    }
}