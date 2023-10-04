import { IpfsDao } from '../model/dao/ipfs-dao';
import { Token } from '../model/dao/token';
import { Dao } from '../model/dao/dao';
import { DaoHeader } from '../model/dao/dao-header';

export interface IDbDaoRepository {
    saveDao(ipfsDao: IpfsDao, daoTokenId: string, ipfsHash: string): Promise<void>;
    findOrCreateDaoToken(daoToken: Token): Promise<Token>;
    findDaosIpfsHashes(offset?: number, limit?: number, filter?: string): Promise<DaoHeader[]>;
    countProposals(daoIpfsHash: string): Promise<number>;
    findDao(daoIpfsHash: string): Promise<Dao | undefined>;
    countDaos(): Promise<number>;
}