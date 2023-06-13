import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';

const ProposalReportOrm = SEQUELIZE.define('proposal_report', {
    ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    result: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    merkle_root_hex: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_votes: {
        type: DataTypes.JSONB,
        allowNull: false
    },
}, {});
export {
    ProposalReportOrm,
}