import { ProposalTypeOrm } from './model/proposal-type-orm';
import { ProposalType } from '../../domain/model/proposal/proposal-type';
import { UserOrm } from './model/user-orm';
import { ProposalOrm } from './model/proposal-orm';
import { VoteOrm } from './model/vote-orm';
import { ProposalReportOrm } from './model/proposal-report-orm';
import { TokenOrm } from './model/dao/token-orm';
import { initializeDaoAssociations } from './model/dao/orm-dao-associations';
import { DaoOrm } from './model/dao/dao-orm';
import { SEQUELIZE } from './sequelize-connection-service';
import { DaoContractOrm } from './model/dao/dao-contract-orm';
import { BlockchainProposalTransactionOrm } from './model/proposal-transaction/blockchain-proposal-transaction-orm';
import { BlockchainProposalOrm } from './model/proposal-transaction/blockchain-proposal-orm';
import {
    BlockchainProposalChainTransactionOrm
} from './model/proposal-transaction/blockchain-proposal-chain-transaction-orm';
import { NftOrm } from './model/nft/nft-orm';

export const syncOrm = async () => {
    try {
        await initializeDaoAssociations();
        await DaoOrm.sync();
        await DaoContractOrm.sync();
        await TokenOrm.sync();
        ProposalTypeOrm.sync()
            .then(() => {
                const constantData = Object.values(ProposalType).map((proposalType) => {
                    return {
                        'type': proposalType.toString(),
                    };
                });
                return ProposalTypeOrm.bulkCreate(constantData, {
                    ignoreDuplicates: true // Ignore rows with duplicate values
                });
            })
            .then(() => {
                console.log('ProposalTypeOrm synced successfully');
            })
            .catch((error) => {
                console.error('Error synchronizing ProposalTypeOrm:', error);
            });
        await UserOrm.sync();
        await ProposalOrm.sync();
        await VoteOrm.sync();
        await ProposalReportOrm.sync();
        await BlockchainProposalOrm.sync();
        await BlockchainProposalOrm.hasMany(BlockchainProposalTransactionOrm, {foreignKey: {name: 'proposal_ipfs_hash', allowNull: false}});
        await BlockchainProposalTransactionOrm.sync();
        await BlockchainProposalOrm.hasMany(BlockchainProposalChainTransactionOrm, {foreignKey: {name: 'proposal_ipfs_hash', allowNull: false}});
        await BlockchainProposalChainTransactionOrm.sync();
        await SEQUELIZE.query("CREATE INDEX if not exists proposal_title_full_text_index_2 ON proposals USING GIN (to_tsvector('simple', title))");
        await SEQUELIZE.query("CREATE INDEX if not exists proposal_ipfs_hash_full_text_index ON proposals USING GIN (to_tsvector('simple', ipfs_hash))");
        await SEQUELIZE.query("CREATE INDEX if not exists dao_name_full_text_index ON daos USING GIN (to_tsvector('simple', name))");
        await SEQUELIZE.query("CREATE INDEX if not exists dao_description_full_text_index ON daos USING GIN (to_tsvector('simple', description))");
        await SEQUELIZE.query("CREATE INDEX if not exists dao_ipfs_hash_full_text_index ON daos USING GIN (to_tsvector('simple', ipfs_hash))");
        await NftOrm.sync();
        // 3.09.2023 - this on address only is replaced with {address, chainId} index
        await SEQUELIZE.getQueryInterface().removeIndex('token', 'dao_token_address_index');
    } catch (error) {
        console.error('Unable to connect to DB:', error);
        throw error;
    }
};
