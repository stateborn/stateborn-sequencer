import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

const BlockchainProposalTransactionOrm = SEQUELIZE.define('blockchain_proposal_transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generate UUIDV4 as default
        primaryKey: true,
    },
    proposal_ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true
    },
}, {});
export {
    BlockchainProposalTransactionOrm,
}