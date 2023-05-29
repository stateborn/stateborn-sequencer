import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';
import { ProposalTypeOrm } from './proposal-type-orm';
import { SequencerOrm } from './sequencer-orm';

const ProposalOrm = SEQUELIZE.define('proposal', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generate UUIDV4 as default
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
    token_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sequencer_signature: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    indexes: [
        {
            name: 'proposal_createdAt_index',
            fields: ['createdAt'],
        },
        {
            name: 'proposal_ipfa_hash_index',
            fields: ['ipfs_hash'],
        }
    ]
});
ProposalOrm.belongsTo(ProposalTypeOrm, {foreignKey: {name: 'proposal_type_type', allowNull: false}});
ProposalOrm.belongsTo(SequencerOrm, {foreignKey: {name: 'sequencer_address', allowNull: false}});
ProposalOrm.sync();
export {
    ProposalOrm,
}