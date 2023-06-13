import { AutoMap } from '@automapper/classes';

export class IpfsReportUserVote {
    @AutoMap()
    ipfsHash: string;
    @AutoMap()
    leafEncoded: string;

    constructor(ipfsHash: string, leafEncoded: string) {
        this.ipfsHash = ipfsHash;
        this.leafEncoded = leafEncoded;
    }
}