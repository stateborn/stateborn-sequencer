import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

const BlockchainProposalChainTransactionOrm = SEQUELIZE.define('blockchain_proposal_chain_transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generate UUIDV4 as default
        primaryKey: true,
    },
    proposal_ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tx_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    transaction_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {});
export {
    BlockchainProposalChainTransactionOrm,
}