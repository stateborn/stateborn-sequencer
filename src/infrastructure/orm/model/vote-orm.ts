import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';
import { ProposalOrm } from './proposal-orm';
import { UserOrm } from './user-orm';

const VoteOrm = SEQUELIZE.define('vote', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generate UUIDV4 as default
        primaryKey: true,
    },
    vote: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    voting_power: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    indexes: [
    ]
});
VoteOrm.belongsTo(ProposalOrm, { foreignKey: {name: 'proposal_ipfs_hash', allowNull: false }});
VoteOrm.belongsTo(UserOrm, { foreignKey: {name: 'user_address', allowNull: false }});
export {
    VoteOrm,
}