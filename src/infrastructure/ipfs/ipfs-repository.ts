import { IPFS_CLIENT } from './ipfs-connection-service';
import { IIpfsRepository } from '../../domain/repository/i-ipfs-repository';
import { IpfsProposal } from '../../domain/model/proposal/ipfs-proposal';
import { IpfsVote } from '../../domain/model/vote/ipfs-vote';
import { IpfsProposalReport } from '../../domain/model/proposal/report/ipfs-proposal-report';
import { IpfsDao } from '../../domain/model/dao/ipfs-dao';
import { IPFSHTTPClient } from 'ipfs-http-client';

export class IpfsRepository implements IIpfsRepository {

    private client: IPFSHTTPClient = IPFS_CLIENT;

    async saveProposal(ipfsProposal: IpfsProposal): Promise<string> {
        return await this.addToIpfs(JSON.stringify(ipfsProposal));
    }

    async saveVote(ipfsVote: IpfsVote): Promise<string> {
        return await this.addToIpfs(JSON.stringify(ipfsVote));
    }

    private async addToIpfs(json: string): Promise<string> {
        const { path } = await this.client.add(json);
        return path;
    }

    async saveProposalReport(ipfsProposalReport: IpfsProposalReport): Promise<string> {
        return await this.addToIpfs(JSON.stringify(ipfsProposalReport));
    }

    async saveDao(ipfsDao: IpfsDao): Promise<string> {
        return await this.addToIpfs(JSON.stringify(ipfsDao));
    }
}