import { AutoMap } from '@automapper/classes';
import { ClientDaoDto } from '../../../interfaces/dto/dao/client-dao-dto';

export class IpfsDao {

    @AutoMap(() => ClientDaoDto)
    clientDao: ClientDaoDto;

    @AutoMap()
    signature: string;

    constructor(dao: ClientDaoDto, signature: string) {
        this.clientDao = dao;
        this.signature = signature;
    }
}