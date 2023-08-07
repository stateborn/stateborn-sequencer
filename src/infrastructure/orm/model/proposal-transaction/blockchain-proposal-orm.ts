import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

const BlockchainProposalOrm = SEQUELIZE.define('blockchain_proposal', {
    proposal_ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    chain_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {});
export {
    BlockchainProposalOrm,
}