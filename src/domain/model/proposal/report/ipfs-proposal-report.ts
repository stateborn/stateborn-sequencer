import { IpfsReportUserVote } from './ipfs-report-user-vote';
import { AutoMap } from '@automapper/classes';

export class IpfsProposalReport {
    @AutoMap()
    proposalIpfsHash: string;
    @AutoMap()
    merkleRootHex: string;
    @AutoMap(() => IpfsReportUserVote)
    userVotes: IpfsReportUserVote[];
    @AutoMap()
    proposalResult: string;

    constructor(proposalIpfsHash: string, merkleRootHex: string, userVotes: IpfsReportUserVote[], proposalResult: string) {
        this.proposalIpfsHash = proposalIpfsHash;
        this.merkleRootHex = merkleRootHex;
        this.userVotes = userVotes;
        this.proposalResult = proposalResult;
    }
}