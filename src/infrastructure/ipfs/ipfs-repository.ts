import { IPFSHTTPClient } from 'ipfs-http-client';
import { IPFS_CLIENT } from './ipfs-connection-service';
import { IIpfsProposalRepository } from '../../domain/repository/i-ipfs-proposal-repository';
import { IpfsProposal } from '../../domain/model/proposal/ipfs-proposal';
import { IpfsVote } from '../../domain/model/vote/ipfs-vote';

export class IpfsRepository implements IIpfsProposalRepository {

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
}