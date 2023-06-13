import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';

const ProposalTypeOrm = SEQUELIZE.define('proposal_type', {
    // Model attributes are defined here
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
}, {
    // Other model options go here
});
export {
    ProposalTypeOrm,
}