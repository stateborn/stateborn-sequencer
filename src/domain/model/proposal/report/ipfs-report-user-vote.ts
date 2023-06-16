import { AutoMap } from '@automapper/classes';

export class IpfsReportUserVote {
    @AutoMap()
    ipfsHash: string;
    @AutoMap()
    leafEncoded: string;
    @AutoMap()
    voterAddress: string;

    constructor(ipfsHash: string, leafEncoded: string, voterAddress: string) {
        this.ipfsHash = ipfsHash;
        this.leafEncoded = leafEncoded;
        this.voterAddress = voterAddress;
    }
}