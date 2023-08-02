import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';

const ProposalTransactionOrm = SEQUELIZE.define('proposal_transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generate UUIDV4 as default
        primaryKey: true,
    },
    transaction_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true
    },
}, {});
export {
    ProposalTransactionOrm,
}