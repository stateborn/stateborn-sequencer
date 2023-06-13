import { ProposalDto } from './proposal-dto';
import { ProposalReportDto } from './report/proposal-report-dto';
import { AutoMap } from '@automapper/classes';

export class ProposalWithReportDto {
    @AutoMap()
    proposal: ProposalDto;
    @AutoMap(() => ProposalReportDto)
    proposalReport?: ProposalReportDto;

    constructor(proposal: ProposalDto, proposalReport?: ProposalReportDto) {
        this.proposal = proposal;
        this.proposalReport = proposalReport;
    }
}