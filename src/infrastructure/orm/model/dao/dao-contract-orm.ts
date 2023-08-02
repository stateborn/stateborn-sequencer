import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

const DaoContractOrm = SEQUELIZE.define('dao_contract', {
    address: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    chain_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
}, {});
export {
    DaoContractOrm,
}