import { IpfsDao } from './ipfs-dao';
import { AutoMap } from '@automapper/classes';

export class Dao {

    @AutoMap(() => IpfsDao)
    ipfsDao: IpfsDao;

    @AutoMap()
    ipfsHash: string;

    constructor(ipfsDao: IpfsDao, ipfsHash: string) {
        this.ipfsDao = ipfsDao;
        this.ipfsHash = ipfsHash;
    }
}