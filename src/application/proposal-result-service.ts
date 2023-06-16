import { IDbVoteRepository } from '../domain/repository/i-db-vote-repository';
import { ProposalResultDto } from '../interfaces/dto/proposal-result-dto';
import { OptionVoteResultDto } from '../interfaces/dto/option-vote-result-dto';

export class ProposalResultService {

    private dbVoteRepository: IDbVoteRepository;

    constructor({dbVoteRepository}: { dbVoteRepository: IDbVoteRepository }) {
        this.dbVoteRepository = dbVoteRepository;
    }

    public async calculateProposalResults(proposalIpfsHash: string): Promise<ProposalResultDto> {
        const votes = await this.dbVoteRepository.findAllVotesOldestFirst(proposalIpfsHash);
        let totalVotes = 0;
        let totalVotesQuantity = 0;
        const votesMap = new Map<string, OptionVoteResultDto>();
        const userVotesMap = new Map<string, any>();
        for (const vote of votes) {
            const voterAddress = vote.ipfsVote.clientVote.voterAddress;
            const votingPower = Number(vote.ipfsVote.clientVote.votingPower);
            if (userVotesMap.has(voterAddress)) {
               const previousUserVote = userVotesMap.get(voterAddress);
               totalVotes -= Number(previousUserVote.votingPower);
               const optionVoteResultDto = votesMap.get(previousUserVote.vote)!;
               optionVoteResultDto.votes = (Number(optionVoteResultDto.votes) - previousUserVote.votingPower).toString();
               totalVotesQuantity -= 1;
            }
            totalVotesQuantity += 1;
            totalVotes += Number(votingPower);
            if (votesMap.has(vote.ipfsVote.clientVote.vote)) {
                const optionVoteResultDto = votesMap.get(vote.ipfsVote.clientVote.vote)!;
                optionVoteResultDto.votes = (Number(optionVoteResultDto.votes) + votingPower).toString();
            } else {
                votesMap.set(vote.ipfsVote.clientVote.vote, new OptionVoteResultDto(vote.ipfsVote.clientVote.vote, votingPower.toString()));
            }
            userVotesMap.set(voterAddress, {
                vote: vote.ipfsVote.clientVote.vote,
                votingPower
            });
        }
        return new ProposalResultDto(totalVotes.toString(), totalVotesQuantity.toString(), Array.from(votesMap.values()));
    }
}