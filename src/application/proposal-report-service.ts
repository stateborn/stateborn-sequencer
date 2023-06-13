import { IDbVoteRepository } from '../domain/repository/i-db-vote-repository';
import { Vote } from '../domain/model/vote/vote';
import { isDateAAfterB } from './date-service';
import { SignatureService } from '../domain/service/signature-service';
import { IDbProposalRepository } from '../domain/repository/i-db-proposal-repository';
import { MerkleTreeService } from './merkle-tree-service';
import { ProposalResultService } from './proposal-result-service';
import { IIpfsRepository } from '../domain/repository/i-ipfs-repository';
import { ProposalReport } from '../domain/model/proposal/report/proposal-report';
import { LOGGER } from '../infrastructure/pino-logger-service';
import { ProposalWithReport } from '../domain/model/proposal/proposal-with-report';
import { IpfsProposalReport } from '../domain/model/proposal/report/ipfs-proposal-report';
import { IpfsReportUserVote } from '../domain/model/proposal/report/ipfs-report-user-vote';

export class ProposalReportService {

    private merkleTreeService: MerkleTreeService;
    private dbVoteRepository: IDbVoteRepository;
    private dbProposalRepository: IDbProposalRepository;
    private signatureService: SignatureService;
    private proposalResultService: ProposalResultService;
    private ipfsRepository: IIpfsRepository;

    constructor({merkleTreeService, dbProposalRepository, dbVoteRepository, signatureService, proposalResultService, ipfsRepository}: {
        merkleTreeService: MerkleTreeService
        dbProposalRepository: IDbProposalRepository
        dbVoteRepository: IDbVoteRepository
        signatureService: SignatureService
        proposalResultService: ProposalResultService
        ipfsRepository: IIpfsRepository
    }) {
        this.merkleTreeService = merkleTreeService;
        this.dbVoteRepository = dbVoteRepository;
        this.dbProposalRepository = dbProposalRepository;
        this.signatureService = signatureService;
        this.proposalResultService = proposalResultService;
        this.ipfsRepository = ipfsRepository;
    }

    public async calculateReport(proposalIpfsHash: string): Promise<string> {
        const proposal: ProposalWithReport | undefined = await this.dbProposalRepository.findProposalWithReportByIpfsHash(proposalIpfsHash);
        if (proposal) {
            const votes = await this.dbVoteRepository.findAllVotesOldestFirst(proposalIpfsHash);
            const reducedVotes = await this.reduceVotes(votes);
            const ipfsReportUserVotes: IpfsReportUserVote[] = [];
            const merkleTreeLeafs: string[] = [];
            for (const vote of reducedVotes) {
                const encodedVoteKeccak256 = this.signatureService.getEncodedVoteKeccak256(vote, proposalIpfsHash);
                ipfsReportUserVotes.push(new IpfsReportUserVote(vote.ipfsHash, encodedVoteKeccak256));
                merkleTreeLeafs.push(encodedVoteKeccak256);
            }
            this.merkleTreeService.initializeMerkleTree(merkleTreeLeafs);
            const merkleRootHex = this.merkleTreeService.getHexRoot();
            const proposalResultDto = await this.proposalResultService.calculateProposalResults(proposalIpfsHash);
            const wonResult = proposalResultDto.voteResults.sort((a, b) => Number(b.votes) - Number(a.votes))[0];
            const ipfsProposalReport = new IpfsProposalReport(
                proposalIpfsHash,
                merkleRootHex,
                ipfsReportUserVotes,
                wonResult ? wonResult.option : '',
            );
            const proposalReportIpfsHash = await this.ipfsRepository.saveProposalReport(ipfsProposalReport);
            await this.dbProposalRepository.saveProposalReport(new ProposalReport(
                proposalReportIpfsHash,
                ipfsProposalReport,
            ));
            LOGGER.info(`Proposal report with ipfs hash ${proposalReportIpfsHash} saved`);
            return proposalReportIpfsHash;
        } else {
            throw new Error(`Proposal with ipfs hash ${proposalIpfsHash} not found`);
        }
    }

    private async reduceVotes(votes: Vote[]): Promise<Vote[]> {
        const votesMap = new Map<string, Vote>();
        for (const vote of votes) {
            votesMap.set(vote.getIpfsVote().getClientVote().getVoterAddress(), vote);
        }
        return Array.from(votesMap.values()).sort(
            (a: Vote, b: Vote) => isDateAAfterB(a.createdAt, b.createdAt) ? 1 : -1)
    }
}