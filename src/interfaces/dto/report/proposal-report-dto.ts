import { AutoMap } from '@automapper/classes';

export class ProposalReportDto {

    @AutoMap()
    ipfsHash: string;

    @AutoMap()
    merkleRootHex: string;

    @AutoMap()
    proposalResult: string;

    constructor(ipfsHash: string, merkleRootHex: string, proposalResult: string) {
        this.ipfsHash = ipfsHash;
        this.merkleRootHex = merkleRootHex;
        this.proposalResult = proposalResult;
    }
}