import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { MapperService } from './mapper/mapper-service';
import { isExpired } from './date-service';
import { ProposalReportService } from './proposal-report-service';

export class GetProposalService {
    private readonly dbProposalRepository: IDbProposalRepository;
    private readonly mapperService: MapperService;
    private readonly proposalReportService: ProposalReportService;

    constructor({dbProposalRepository, mapperService, proposalReportService}: {
        dbProposalRepository: IDbProposalRepository
        mapperService: MapperService,
        proposalReportService: ProposalReportService,
    }) {
        this.dbProposalRepository = dbProposalRepository;
        this.mapperService = mapperService;
        this.proposalReportService = proposalReportService;
    }

    public async getProposal(ipfsHash: string) {
        let proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(ipfsHash);
        if (proposalWithReport !== undefined) {
            if (isExpired(proposalWithReport.proposal.getIpfsProposal().clientProposal.endDateUtc) && proposalWithReport.proposalReport === undefined) {
                // generating report
                await this.proposalReportService.calculateReport(ipfsHash);
                // re-read proposal
                proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(ipfsHash);
            }
            return proposalWithReport ? this.mapperService.toProposalWithReportDto(proposalWithReport) : undefined;
        } else {
            throw new Error(`Proposal with ipfsHash ${ipfsHash} is not found!`);
        }

    }
}