import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';
import { ProposalType } from '../../../domain/model/proposal/proposal-type';

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
ProposalTypeOrm.sync()
    .then(() => {
        const constantData = Object.values(ProposalType).map((proposalType) => {
            return {
                'type': proposalType.toString(),
            };
        });
        return ProposalTypeOrm.bulkCreate(constantData, {
            ignoreDuplicates: true // Ignore rows with duplicate values
        });
    })
    .then(() => {
        console.log('ProposalTypeOrm synced successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing ProposalTypeOrm:', error);
    });

export {
    ProposalTypeOrm,
}