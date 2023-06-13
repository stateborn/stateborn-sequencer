import { AutoMap } from '@automapper/classes';

export class ProposalReportDto {
    @AutoMap()
    ipfsHash: string;
    @AutoMap()
    merkleRootHex: string;

    constructor(ipfsHash: string, merkleRootHex: string) {
        this.ipfsHash = ipfsHash;
        this.merkleRootHex = merkleRootHex;
    }
}