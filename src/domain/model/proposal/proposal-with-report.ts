import { Proposal } from './proposal';
import { ProposalReport } from './report/proposal-report';
import { AutoMap } from '@automapper/classes';

export class ProposalWithReport {
    @AutoMap()
    proposal: Proposal;
    @AutoMap(() => ProposalReport)
    proposalReport?: ProposalReport;

    constructor(proposal: Proposal, proposalReport?: ProposalReport) {
        this.proposal = proposal;
        this.proposalReport = proposalReport;
    }
}