import { IpfsDao } from '../model/dao/ipfs-dao';
import { DaoToken } from '../model/dao/dao-token';
import { Dao } from '../model/dao/dao';

export interface IDbDaoRepository {
    saveDao(ipfsDao: IpfsDao, daoTokenId: string, ipfsHash: string): Promise<void>;
    findOrCreateDaoToken(daoToken: DaoToken): Promise<DaoToken>;
    findDaosIpfsHashes(offset?: number, limit?: number, filter?: string): Promise<string[]>;
    findDao(daoIpfsHash: string): Promise<Dao | undefined>;
    countDaos(): Promise<number>;
}