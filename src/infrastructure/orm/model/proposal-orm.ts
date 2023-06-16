import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';
import { ProposalTypeOrm } from './proposal-type-orm';
import { SequencerOrm } from './sequencer-orm';
import { ProposalReportOrm } from './proposal-report-orm';
import { Dao } from '../../../domain/model/dao/dao';
import { DaoOrm } from './dao/dao-orm';

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
ProposalOrm.belongsTo(SequencerOrm, {foreignKey: {name: 'creator_address', allowNull: false}});
ProposalOrm.hasOne(ProposalReportOrm, {foreignKey: {name: 'proposal_ipfs_hash', allowNull: false}});
export {
    ProposalOrm,
}