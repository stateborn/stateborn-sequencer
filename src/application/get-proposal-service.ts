import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { MapperService } from './mapper/mapper-service';
import { isExpired } from './date-service';
import { ProposalReportService } from './proposal-report-service';
import { IDbDaoRepository } from '../domain/repository/i-db-dao-repository';
import { ProposalTransactionService } from './proposal-transaction-service';

export class GetProposalService {
    private readonly dbProposalRepository: IDbProposalRepository;
    private readonly dbDaoRepository: IDbDaoRepository;
    private readonly mapperService: MapperService;
    private readonly proposalReportService: ProposalReportService;
    private readonly proposalTransactionService: ProposalTransactionService;

    constructor({dbProposalRepository, dbDaoRepository, mapperService, proposalReportService, proposalTransactionService}: {
        dbProposalRepository: IDbProposalRepository
        dbDaoRepository: IDbDaoRepository
        mapperService: MapperService,
        proposalReportService: ProposalReportService,
        proposalTransactionService: ProposalTransactionService,
    }) {
        this.dbProposalRepository = dbProposalRepository;
        this.dbDaoRepository = dbDaoRepository;
        this.mapperService = mapperService;
        this.proposalReportService = proposalReportService;
        this.proposalTransactionService = proposalTransactionService;
    }

    public async getProposal(ipfsHash: string) {
        let proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(ipfsHash);
        if (proposalWithReport !== undefined) {
            if (isExpired(proposalWithReport.proposal.ipfsProposal.clientProposal.endDateUtc) && proposalWithReport.proposalReport === undefined) {
            // if (true) {
                await this.proposalReportService.calculateReport(ipfsHash);
                proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(ipfsHash);
                // await this.proposalTransactionService.createProposalTransactions(ipfsHash);
                // await this.proposalTransactionService.executeProposalTransactions(ipfsHash);
            }
            return proposalWithReport ? this.mapperService.toProposalDto(proposalWithReport.proposal) : undefined;
        } else {
            throw new Error(`Proposal with ipfsHash ${ipfsHash} is not found!`);
        }
    }

    public async getProposalReport(ipfsHash: string) {
        let proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(ipfsHash);
        if (proposalWithReport !== undefined) {
            if (isExpired(proposalWithReport.proposal.ipfsProposal.clientProposal.endDateUtc) && proposalWithReport.proposalReport === undefined) {
                // generating report
                await this.proposalReportService.calculateReport(ipfsHash);
                // re-read proposal
                proposalWithReport = await this.dbProposalRepository.findProposalWithReportByIpfsHash(ipfsHash);
            }
            return proposalWithReport ? this.mapperService.toProposalReportDto(proposalWithReport.proposalReport!) : undefined;
        } else {
            throw new Error(`Proposal with ipfsHash ${ipfsHash} is not found!`);
        }

    }

}