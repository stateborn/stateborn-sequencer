import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

const TokenBlacklistOrm = SEQUELIZE.define('token_blacklist', {
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    chain_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    token_type: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {});


export {
    TokenBlacklistOrm,
}
