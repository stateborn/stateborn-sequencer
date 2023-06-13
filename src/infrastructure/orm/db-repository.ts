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
import { ProposalReport } from '../../domain/model/proposal/report/proposal-report';
import { ProposalReportOrm } from './model/proposal-report-orm';
import { ProposalWithReport } from '../../domain/model/proposal/proposal-with-report';
import { IpfsProposalReport } from '../../domain/model/proposal/report/ipfs-proposal-report';
import { IDbDaoRepository } from '../../domain/repository/i-db-dao-repository';
import { IpfsDao } from '../../domain/model/dao/ipfs-dao';
import { DaoOrm } from './model/dao/dao-orm';
import { TokenOrm } from './model/dao/token-orm';
import { DaoToken } from '../../domain/model/dao/dao-token';
import { DaoTokenType } from '../../domain/model/dao/dao-token-type';
import { Dao } from '../../domain/model/dao/dao';
import { ClientDaoDto } from '../../interfaces/dto/dao/client-dao-dto';
import { ClientDaoTokenDto } from '../../interfaces/dto/dao/client-dao-token-dto';

export class DbRepository implements IDbProposalRepository, IDbSequencerRepository, IDbUserRepository, IDbVoteRepository, IDbDaoRepository {

    async findDaos(offset?: number | undefined, limit?: number | undefined): Promise<Dao[]> {
        const props = await DaoOrm.findAll({
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
            include: [TokenOrm],
        });
        return props.map(this.toDao());
    }

    private toDao() {
        return (p: Model<any, any>) =>
            new Dao(
                new IpfsDao(
                    new ClientDaoDto(
                        <string>p.get('name', {plain: true}),
                        <string>p.get('description', {plain: true}),
                        <string>p.get('image_base64', {plain: true}),
                        <string[]>p.get('owners', {plain: true}),
                        <string>p.get('owners_multisig_threshold', {plain: true}),
                        <string>p.get('proposal_token_required_quantity', { plain: true }),
                        new ClientDaoTokenDto(
                            (<any>p.get('tokens', {plain: true}))[0].address,
                            (<any>p.get('tokens', {plain: true}))[0].name,
                            (<any>p.get('tokens', {plain: true}))[0].symbol,
                            (<any>p.get('tokens', {plain: true}))[0].type,
                            (<any>p.get('tokens', {plain: true}))[0].network,
                        )),
                    <string>p.get('signature', {plain: true})),
                <string>p.get('ipfs_hash', {plain: true}));
    }

    async saveDao(ipfsDao: IpfsDao, daoTokenId: string, ipfsHash: string): Promise<void> {
        const token = await TokenOrm.findByPk(daoTokenId);
        try {
            const dao = await DaoOrm.create({
                ipfs_hash: ipfsHash,
                name: ipfsDao.clientDao.name,
                description: ipfsDao.clientDao.description,
                image_base64: ipfsDao.clientDao.imageBase64,
                owners: ipfsDao.clientDao.owners,
                owners_multisig_threshold: ipfsDao.clientDao.ownersMultisigThreshold,
                proposal_token_required_quantity: ipfsDao.clientDao.proposalTokenRequiredQuantity,
            });
            // @ts-ignore
            await dao.addToken(token);
            await dao.save();
        } catch (err) {
            console.log(err);
        }
    }
    async saveVote(ipfsVote: IpfsVote, ipfsHash: string, proposalIpfsHash: string): Promise<void> {
        const props = VoteOrm.build({
            ipfs_hash: ipfsHash,
            user_address: ipfsVote.getClientVote().getVoterAddress(),
            proposal_ipfs_hash: proposalIpfsHash,
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

    async findOrCreateDaoToken(daoToken: DaoToken): Promise<DaoToken> {
        const [data, created] = await TokenOrm.findOrCreate({
            where: {address: daoToken.address},
            defaults: this.daoTokenToUnsavedTokenOrm(daoToken)
        });
        return new DaoToken(
            <string>data.get('address', {plain: true}),
            <string>data.get('name', {plain: true}),
            <string>data.get('symbol', {plain: true}),
            <DaoTokenType>data.get('type', {plain: true}),
            <string>data.get('network', {plain: true}),
            <any>data.get('data', {plain: true}),
            <any>data.get('id', {plain: true}),
        );
    }


    private daoTokenToUnsavedTokenOrm(daoToken: DaoToken) {
        return {
            address: daoToken.address,
            name: daoToken.name,
            symbol: daoToken.symbol,
            type: daoToken.type,
            network: daoToken.network,
            data: daoToken.data,
        };
    }

    async findProposalWithReportByIpfsHash(ipfsHash: string): Promise<ProposalWithReport | undefined> {
        const props = await ProposalOrm.findOne({
            where: {ipfs_hash: ipfsHash},
            include: [ProposalReportOrm],
        });
        if (props) {
            const proposal = this.toProposal()(props);
            let proposalReport = undefined;
            if (props.get('proposal_report', {plain: true}) !== null) {
                proposalReport = this.toProposalReport()(props);
            }
            return new ProposalWithReport(proposal, proposalReport);
        }
        return undefined;
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
            creator_address: ipfsProposal.clientProposal.creatorAddress,
            title: ipfsProposal.clientProposal.title,
            description: ipfsProposal.clientProposal.description,
            proposal_type_type: ipfsProposal.clientProposal.proposalType,
            ipfs_hash: ipfsHash,
            creator_signature: ipfsProposal.creatorSignature,
            start_date: ipfsProposal.clientProposal.startDateUtc,
            end_date: ipfsProposal.clientProposal.endDateUtc,
            dao_ipfs_hash: ipfsProposal.clientProposal.daoIpfsHash,
            data: ipfsProposal.clientProposal.data,
        });
        await props.save();
    }

    public async findProposals(daoIpfsHash: string, offset: number = 0, limit: number = 10): Promise<Proposal[]> {
        const props = await ProposalOrm.findAll({
            offset: offset,
            limit: limit,
            where: {dao_ipfs_hash: daoIpfsHash},
            order: [['createdAt', 'DESC']],
        });
        return props.map(this.toProposal());
    }

    private toProposal() {
        return (p: Model<any, any>) =>
            new Proposal(
                new IpfsProposal(
                    new ClientProposal(
                        <string>p.get('creator_address', {plain: true}),
                        <string>p.get('dao_ipfs_hash', {plain: true}),
                        <string>p.get('title', {plain: true}),
                        <string>p.get('description', {plain: true}),
                        <ProposalType>p.get('proposal_type_type', {plain: true}),
                        (<Date>p.get('start_date', { plain: true })).toISOString(),
                        (<Date>p.get('end_date', {plain: true})).toISOString(),
                        <any | undefined>p.get('data', {plain: true})),
                    <string>p.get('author_signature', {plain: true})),
                <string>p.get('ipfs_hash', {plain: true}));
    }

    private toProposalReport() {
        return (p: Model<any, any>) =>
            new ProposalReport(
                (<any>p.get('proposal_report', {plain: true})).ipfs_hash,
                new IpfsProposalReport(
                    (<any>p.get('proposal_report', {plain: true})).proposal_ipfs_hash,
                    (<any>p.get('proposal_report', {plain: true})).merkle_root_hex,
                    (<any>p.get('proposal_report', {plain: true})).user_votes,
                    (<any>p.get('proposal_report', {plain: true})).proposal_result,
                ),
            );
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
                <string>p.get('id', {plain: true}), <string>p.get('ipfs_hash', {plain: true}),
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

    async findAllVotesOldestFirst(proposalIpfsHash: string): Promise<Vote[]> {
        const props = await VoteOrm.findAll({
            include: [{model: ProposalOrm, where: {ipfs_hash: proposalIpfsHash}}],
            order: [['createdAt', 'ASC']],
        });
        return props.map(this.toVote());
    }

    async saveProposalReport(proposalReport: ProposalReport): Promise<void> {
        const props = ProposalReportOrm.build({
            ipfs_hash: proposalReport.ipfsHash,
            proposal_ipfs_hash: proposalReport.ipfsProposalReport.proposalIpfsHash,
            result: proposalReport.ipfsProposalReport.proposalResult,
            merkle_root_hex: proposalReport.ipfsProposalReport.merkleRootHex,
            user_votes: {
                userVotes: proposalReport.ipfsProposalReport.userVotes,
            },
        });
        await props.save();
    }

    async findDao(daoIpfsHash: string): Promise<Dao | undefined> {
        const props = await DaoOrm.findByPk(daoIpfsHash, {
            include: [TokenOrm],
        });
        return this.toDao()(props!);
    }

}