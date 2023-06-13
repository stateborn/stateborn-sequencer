import { IpfsVote } from './ipfs-vote';
import { AutoMap } from '@automapper/classes';

export class Vote {
    @AutoMap(() => IpfsVote)
    readonly ipfsVote: IpfsVote;
    @AutoMap()
    readonly id: string;
    @AutoMap()
    readonly ipfsHash: string;
    @AutoMap()
    readonly createdAt: Date;

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