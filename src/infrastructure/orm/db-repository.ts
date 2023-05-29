import { IDbProposalRepository } from '../../domain/repository/i-db-proposal-repository';
import { ProposalOrm } from './model/proposal-orm';
import { IDbSequencerRepository } from '../../domain/repository/i-db-sequencer-repository';
import { Sequencer } from '../../domain/model/sequencer';
import { SequencerOrm } from './model/sequencer-orm';
import { Model } from 'sequelize';
import { Proposal } from '../../domain/model/proposal/proposal';
import { IpfsProposal } from '../../domain/model/proposal/ipfs-proposal';
import { ClientProposal } from '../../domain/model/proposal/client-proposal';
import { ProposalType } from '../../domain/model/proposal/proposal-type';
import { IDbUserRepository } from '../../domain/repository/i-db-user-repository';
import { User } from '../../domain/model/user';
import { UserOrm } from './model/user-orm';
import { IDbVoteRepository } from '../../domain/repository/i-db-vote-repository';
import { IpfsVote } from '../../domain/model/vote/ipfs-vote';
import { VoteOrm } from './model/vote-orm';
import { Vote } from '../../domain/model/vote/vote';
import { ClientVote } from '../../domain/model/vote/client-vote';
import { YesNoVote } from '../../domain/model/vote/yes-no-vote';

export class DbRepository implements IDbProposalRepository, IDbSequencerRepository, IDbUserRepository, IDbVoteRepository {
    async saveVote(ipfsVote: IpfsVote, ipfsHash: string, proposalId: string): Promise<void> {
        const props = VoteOrm.build({
            ipfs_hash: ipfsHash,
            user_address: ipfsVote.getClientVote().getVoterAddress(),
            proposal_id: proposalId,
            vote: ipfsVote.getClientVote().getVote(),
            voting_power: Number(ipfsVote.getClientVote().getVotingPower()),
        });
        await props.save();
    }

    async findOrCreateUser(address: string): Promise<User> {
        const [sequencer, created] = await UserOrm.findOrCreate({
            where: {address: address},
            defaults: {
                address: address
            }
        });
        return new User(<string>sequencer.get('address', {plain: true}));
    }

    async findProposalByIpfsHash(ipfsHash: string): Promise<Proposal | undefined> {
        const proposal = await ProposalOrm.findOne({
            where: {ipfs_hash: ipfsHash},
        });
        return proposal ? this.toProposal()(proposal) : undefined;
    }

    async findOrCreateSequencer(address: string): Promise<Sequencer> {
        const [sequencer, created] = await SequencerOrm.findOrCreate({
            where: {address: address},
            defaults: {
                address: address
            }
        });
        return new Sequencer(<string>sequencer.get('address', {plain: true}));
    }

    public async saveProposal(ipfsProposal: IpfsProposal, ipfsHash: string): Promise<void> {
        const props = ProposalOrm.build({
            sequencer_address: ipfsProposal.getClientProposal().getSequencerAddress(),
            title: ipfsProposal.getClientProposal().getTitle(),
            description: ipfsProposal.getClientProposal().getDescription(),
            token_address: ipfsProposal.getClientProposal().getTokenAddress(),
            proposal_type_type: ipfsProposal.getClientProposal().getProposalType(),
            ipfs_hash: ipfsHash,
            sequencer_signature: ipfsProposal.getSequencerSignature(),
        });
        await props.save();
    }

    public async findProposals(offset: number = 0, limit: number = 10): Promise<Proposal[]> {
        const props = await ProposalOrm.findAll({
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
        });
        return props.map(this.toProposal());
    }

    private toProposal() {
        return (p: Model<any, any>) =>
            new Proposal(
                new IpfsProposal(
                    new ClientProposal(
                        <string>p.get('sequencer_address', {plain: true}),
                        <string>p.get('title', {plain: true}),
                        <string>p.get('description', {plain: true}),
                        <string>p.get('token_address', {plain: true}),
                        <ProposalType>p.get('proposal_type_type', {plain: true})),
                    <string>p.get('sequencer_signature', {plain: true})),
                <string>p.get('ipfs_hash', {plain: true}),
                <string>p.get('id', {plain: true}));
    }

    async findVotes(proposalIpfsHash: string, offset?: number, limit?: number): Promise<Vote[]> {
        const props = await VoteOrm.findAll({
            include: [{model: ProposalOrm, where: {ipfs_hash: proposalIpfsHash}}],
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
        });
        return props.map(this.toVote());
    }

    private toVote() {
        return (p: Model<any, any>) =>
            new Vote(
                new IpfsVote(
                    new ClientVote(
                        <string>p.get('user_address', {plain: true}),
                        <string>p.get('proposal.ipfs_hash', {plain: true}),
                        <YesNoVote>p.get('vote', {plain: true}),
                        (<Number>p.get('voting_power', {plain: true})).toString()),
                    <string>p.get('sequencer_signature', {plain: true})),
                <string>p.get('id', {plain: true}),
                <string>p.get('ipfs_hash', {plain: true}),
                <Date>p.get('createdAt', {plain: true}));
    }

    async findUserAddressVotes(proposalIpfsHash: string, userAddress: string): Promise<Vote[]> {
        const props = await VoteOrm.findAll({
            include: [{model: ProposalOrm, where: {ipfs_hash: proposalIpfsHash}}],
            where: {user_address: userAddress},
            order: [['createdAt', 'DESC']],
        });
        return props.map(this.toVote());
    }

}