import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

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
    chain_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    decimals: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data: {
        type: DataTypes.JSONB,
        allowNull: true
    },
}, {
    indexes: [
        {
            name: 'dao_token_address_chain_id_index',
            fields: ['address', 'chain_id'],
        },
    ]
});
export {
    TokenOrm,
}