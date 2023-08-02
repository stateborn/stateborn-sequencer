import { IDbProposalRepository } from '../../domain/repository/i-db-proposal-repository';
import { ProposalOrm } from './model/proposal-orm';
import { col, fn, Model, Op, QueryTypes } from 'sequelize';
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
import { TokenType } from '../../domain/model/dao/token-type';
import { Dao } from '../../domain/model/dao/dao';
import { SEQUELIZE } from './sequelize-connection-service';
import { DaoHeader } from '../../domain/model/dao/dao-header';
import { ClientDao } from '../../domain/model/dao/client-dao';
import { ClientToken } from '../../domain/model/dao/client-token';
import { DaoContractOrm } from './model/dao/dao-contract-orm';
import { ProposalTransactionType } from '../../domain/model/proposal/proposal-transaction-type';
import { ProposalTransactionOrm } from './model/proposal-transaction-orm';
import { ProposalTransactionStatus } from '../../domain/model/proposal/proposal-transaction-status';
import { ClientProposalTransaction } from '../../domain/model/proposal/client-proposal-transaction';
import { ProposalTransactionData } from '../../domain/model/proposal/proposal-transaction/proposal-transaction-data';

export class DbRepository implements IDbProposalRepository, IDbUserRepository, IDbVoteRepository, IDbDaoRepository {

    async findDaosIpfsHashes(offset?: number, limit?: number, filter?: string): Promise<DaoHeader[]> {
        const searchParams: any = {
            subQuery: false,
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']],
            attributes: ['ipfs_hash',  [fn('COUNT', col('proposals.dao_ipfs_hash')), 'proposalCount']],
            include: [{
                model: ProposalOrm,
                as: 'proposals', // replace with the identifier you used in the associations
                attributes: []  // This is important! Only the count column will be included in the result.
            }],
            group: ['dao.ipfs_hash'],
        };
        if (filter !== undefined && filter.trim() !== '') {
            searchParams.where = {
                [Op.or]: [
                    {
                        name: {[Op.match]: SEQUELIZE.fn('websearch_to_tsquery', `${filter.trim()}:*`)}
                    },
                    {
                        description: {[Op.match]: SEQUELIZE.fn('websearch_to_tsquery', `${filter.trim()}:*`)},
                    },
                    {
                        ipfs_hash: {[Op.match]: SEQUELIZE.fn('websearch_to_tsquery', filter.trim())},
                    }
                ],
            };
        }
        const props = await DaoOrm.findAll(searchParams);
        return props.map(_ => new DaoHeader(
            <string>_.get('ipfs_hash', {plain: true}),
            Number(<string>_.get('proposalCount', {plain: true}))
        ));
    }

    private toDao() {
        return (p: Model<any, any>) =>
            new Dao(
                new IpfsDao(
                    new ClientDao(
                        <string>p.get('name', {plain: true}),
                        <string>p.get('description', {plain: true}),
                        <string>p.get('image_base64', {plain: true}),
                        <string[]>p.get('owners', {plain: true}),
                        <string>p.get('owners_multisig_threshold', {plain: true}),
                        <string>p.get('proposal_token_required_quantity', {plain: true}),
                        (<Date>p.get('creation_date_utc', {plain: true})).toISOString(),
                        new ClientToken(
                            (<any>p.get('tokens', {plain: true}))[0].address,
                            (<any>p.get('tokens', {plain: true}))[0].name,
                            (<any>p.get('tokens', {plain: true}))[0].symbol,
                            (<any>p.get('tokens', {plain: true}))[0].type,
                            (<any>p.get('tokens', {plain: true}))[0].chain_id,
                            (<any>p.get('tokens', {plain: true}))[0].decimals.toString(),
                        ),
                        (<any>p.get('dao_contracts', {plain: true}))[0]?.address,
                    ),
                    <string>p.get('signature', {plain: true})),
                <string>p.get('ipfs_hash', {plain: true}));
    }

    async saveDao(ipfsDao: IpfsDao, daoTokenId: string, ipfsHash: string): Promise<void> {
        const token = await TokenOrm.findByPk(daoTokenId);
        const dao = await DaoOrm.create({
            ipfs_hash: ipfsHash,
            name: ipfsDao.clientDao.name,
            description: ipfsDao.clientDao.description,
            image_base64: ipfsDao.clientDao.imageBase64,
            owners: ipfsDao.clientDao.owners,
            owners_multisig_threshold: ipfsDao.clientDao.ownersMultisigThreshold,
            proposal_token_required_quantity: ipfsDao.clientDao.proposalTokenRequiredQuantity,
            creation_date_utc: ipfsDao.clientDao.creationDateUtc,
        });
        // @ts-ignore
        await dao.addToken(token);
        await dao.save();
        if (ipfsDao.clientDao.contractAddress !== undefined) {
            const contractAddress = await DaoContractOrm.create(
                {
                    address: ipfsDao.clientDao.contractAddress,
                    chain_id: ipfsDao.clientDao.token.chainId,
                    dao_ipfs_hash: ipfsHash,
                }
            );
            await contractAddress.save();
        }
    }

    async saveVote(ipfsVote: IpfsVote, ipfsHash: string, proposalIpfsHash: string): Promise<void> {
        const props = VoteOrm.build({
            ipfs_hash: ipfsHash,
            user_address: ipfsVote.clientVote.voterAddress,
            proposal_ipfs_hash: proposalIpfsHash,
            vote: ipfsVote.clientVote.vote,
            voting_power: Number(ipfsVote.clientVote.votingPower),
            vote_date: ipfsVote.clientVote.voteDate,
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
        try {

            const [data, created] = await TokenOrm.findOrCreate({
                where: {address: daoToken.address},
                defaults: this.daoTokenToUnsavedTokenOrm(daoToken)
            });
            return new DaoToken(
                <string>data.get('address', {plain: true}),
                <string>data.get('name', {plain: true}),
                <string>data.get('symbol', {plain: true}),
                <TokenType>data.get('type', {plain: true}),
                <string>data.get('chain_id', {plain: true}),
                <any>data.get('data', {plain: true}),
                <any>data.get('decimals', {plain: true}),
                <any>data.get('id', {plain: true}),
            );
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    private daoTokenToUnsavedTokenOrm(daoToken: DaoToken) {
        return {
            address: daoToken.address,
            name: daoToken.name,
            symbol: daoToken.symbol,
            type: daoToken.type,
            chain_id: daoToken.chainId,
            data: daoToken.data,
            decimals: daoToken.decimals,
        };
    }

    async findProposalWithReportByIpfsHash(ipfsHash: string): Promise<ProposalWithReport | undefined> {
        const props = await ProposalOrm.findOne({
            where: {ipfs_hash: ipfsHash},
            include: [ProposalReportOrm, ProposalTransactionOrm],
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

    //todo: requires transaction
    public async saveProposal(ipfsProposal: IpfsProposal, ipfsHash: string): Promise<void> {
        try {

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
            block_number: ipfsProposal.clientProposal.blockNumber,
            data: ipfsProposal.clientProposal.data,
        });
        await props.save();
            if (ipfsProposal.clientProposal.transactions) {
                const transactions = ipfsProposal.clientProposal.transactions!.map((_) => {
                    return {
                        proposal_ipfs_hash: ipfsHash,
                        transaction_type: _.transactionType,
                        transaction_status: ProposalTransactionStatus.SAVED,
                        data: _.data,
                    };
                });
                await ProposalTransactionOrm.bulkCreate(transactions);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async findProposalsIpfsHashes(daoIpfsHash: string, offset: number = 0, limit: number = 10, filter?: string): Promise<string[]> {
        let whereClause: any = {dao_ipfs_hash: daoIpfsHash};
        if (filter !== undefined && filter.trim() !== '') {
            whereClause = {
                [Op.and] : [
                    {dao_ipfs_hash: daoIpfsHash},
                    {
                        [Op.or]: [
                            {
                                title: {[Op.match]: SEQUELIZE.fn('websearch_to_tsquery', `${filter.trim()}:*`)}
                            },
                            {
                                ipfs_hash: {[Op.match]: SEQUELIZE.fn('websearch_to_tsquery', filter.trim())},
                            }
                        ],
                    }
                ],
            };
        }
        try {

            const props = await ProposalOrm.findAll({
                offset: offset,
                limit: limit,
                where: whereClause,
                order: [['createdAt', 'DESC']],
                attributes: ['ipfs_hash'],
            });
            return props.map(_ => <string>_.get('ipfs_hash', {plain: true}));
        } catch (err) {
            console.log(err);
            throw err;
        }
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
                        (<Date>p.get('start_date', {plain: true})).toISOString(),
                        (<Date>p.get('end_date', {plain: true})).toISOString(),
                        (<string>p.get('block_number', {plain: true})).toString(),
                        <any | undefined>p.get('data', {plain: true}),
                        (<any[]>p.get('proposal_transactions', {plain: true})).map(_ => {
                            return new ClientProposalTransaction(
                                <ProposalTransactionType>_.transaction_type,
                                <ProposalTransactionData>_.data,
                            );
                        })
                    ),
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
                        <string>p.get('proposal_ipfs_hash', {plain: true}),
                        <YesNoVote>p.get('vote', {plain: true}),
                        (<Number>p.get('voting_power', {plain: true})).toString(),
                        (<Date>p.get('vote_date', {plain: true})).toISOString()),
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

    async findAllVotesOldestFirst(proposalIpfsHash: string): Promise<Vote[]> {
        try {
            const props = await VoteOrm.findAll({
                include: [{model: ProposalOrm, where: {ipfs_hash: proposalIpfsHash}}],
                order: [['createdAt', 'ASC']],
            });
            return props.map(this.toVote());
        } catch (Err) {
            console.log(Err);
            return [];
        }
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
            include: [TokenOrm, DaoContractOrm],
        });
        return this.toDao()(props!);
    }

    async countProposals(daoIpfsHash: string): Promise<number> {
        return await ProposalOrm.count({
            where: {
                dao_ipfs_hash: daoIpfsHash,
            }
        });
    }

    async countDaos(): Promise<number> {
        return await DaoOrm.count();
    }

    async countVotes(proposalIpfsHash: string): Promise<number> {
        return await VoteOrm.count({
            where: {
                proposal_ipfs_hash: proposalIpfsHash,
            }
        });
    }

    async countDistinctVotes(proposalIpfsHash: string): Promise<number> {
        const totalVotes = await SEQUELIZE.query(`
            SELECT COUNT(*) as total_votes
            FROM (SELECT DISTINCT
                  ON (votes.user_address) votes.*
                  FROM votes
                      INNER JOIN proposals
                  ON votes.proposal_ipfs_hash = proposals.ipfs_hash
                  WHERE proposals.ipfs_hash = :hash
                  ORDER BY votes.user_address, votes."createdAt" DESC) as distinct_votes`, {
            replacements: {hash: proposalIpfsHash},
            type: QueryTypes.SELECT,
        });
        // @ts-ignore
        return Number(totalVotes[0].total_votes).toFixed(0);
    }
}