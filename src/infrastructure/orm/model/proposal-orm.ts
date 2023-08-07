import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';
import { ProposalTypeOrm } from './proposal-type-orm';
import { ProposalReportOrm } from './proposal-report-orm';
import { DaoOrm } from './dao/dao-orm';
import { BlockchainProposalTransactionOrm } from './proposal-transaction/blockchain-proposal-transaction-orm';
import { BlockchainProposalOrm } from './proposal-transaction/blockchain-proposal-orm';
import {
    BlockchainProposalChainTransactionOrm
} from './proposal-transaction/blockchain-proposal-chain-transaction-orm';

const ProposalOrm = SEQUELIZE.define('proposal', {
    ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    creator_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creator_signature: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    block_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true
    }
}, {
    indexes: [
        {
            name: 'proposal_createdAt_index',
            fields: ['createdAt'],
        },
    ]
});
ProposalOrm.belongsTo(DaoOrm, {foreignKey: {name: 'dao_ipfs_hash', allowNull: false}});
ProposalOrm.belongsTo(ProposalTypeOrm, {foreignKey: {name: 'proposal_type_type', allowNull: false}});
ProposalOrm.hasOne(ProposalReportOrm, {foreignKey: {name: 'proposal_ipfs_hash', allowNull: false}});
ProposalOrm.hasOne(BlockchainProposalOrm, {foreignKey: {name: 'proposal_ipfs_hash', allowNull: false}});
ProposalOrm.hasMany(BlockchainProposalTransactionOrm, {foreignKey: {name: 'proposal_ipfs_hash', allowNull: false}});
ProposalOrm.hasMany(BlockchainProposalChainTransactionOrm, {foreignKey: {name: 'proposal_ipfs_hash', allowNull: false}});
export {
    ProposalOrm,
}