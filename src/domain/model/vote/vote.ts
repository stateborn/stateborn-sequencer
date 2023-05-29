import { IpfsVote } from './ipfs-vote';
import { AutoMap } from '@automapper/classes';

export class Vote {
    @AutoMap(() => IpfsVote)
    private readonly ipfsVote: IpfsVote;
    @AutoMap()
    private readonly id: string;
    @AutoMap()
    private readonly ipfsHash: string;
    @AutoMap()
    private readonly createdAt: Date;
    constructor(ipfsVote: IpfsVote, id: string, ipfsHash: string, createdAt: Date) {
        this.ipfsVote = ipfsVote;
        this.id = id;
        this.ipfsHash = ipfsHash;
        this.createdAt = createdAt;
    }

    public getIpfsVote(): IpfsVote {
        return this.ipfsVote;
    }
}