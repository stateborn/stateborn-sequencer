import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';
import { DaoOrm } from './dao-orm';

const TokenOrm = SEQUELIZE.define('token', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generate UUIDV4 as default
        primaryKey: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    symbol: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    network: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true
    },
}, {
    indexes: [
        {
            name: 'dao_token_address_index',
            fields: ['address'],
        },
    ]
});
export {
    TokenOrm,
}