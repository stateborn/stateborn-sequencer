import { Proposal } from './proposal';
import { ProposalReport } from './report/proposal-report';
import { AutoMap } from '@automapper/classes';
import { BlockchainProposal } from './proposal-transaction/blockchain-proposal';

export class ProposalWithReportAndBlockchainProposal {
    @AutoMap()
    proposal: Proposal;
    @AutoMap(() => ProposalReport)
    proposalReport?: ProposalReport;
    blockchainProposal?: BlockchainProposal | undefined;

    constructor(proposal: Proposal, proposalReport?: ProposalReport, blockchainProposal?: BlockchainProposal) {
        this.proposal = proposal;
        this.proposalReport = proposalReport;
        this.blockchainProposal = blockchainProposal;
    }
}