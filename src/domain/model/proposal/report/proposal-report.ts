import { AutoMap } from '@automapper/classes';
import { IpfsProposalReport } from './ipfs-proposal-report';

export class ProposalReport {

    @AutoMap()
    ipfsHash: string;

    @AutoMap(() => IpfsProposalReport)
    ipfsProposalReport: IpfsProposalReport;

    constructor(ipfsHash: string, ipfsProposalReport: IpfsProposalReport) {
        this.ipfsHash = ipfsHash;
        this.ipfsProposalReport = ipfsProposalReport;
    }
}