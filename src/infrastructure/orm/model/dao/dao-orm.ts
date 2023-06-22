import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

const DaoOrm = SEQUELIZE.define('dao', {
    ipfs_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_base64: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    owners: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    owners_multisig_threshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    proposal_token_required_quantity: {
        type: DataTypes.INTEGER,
    },
    //client creation date
    creation_date_utc: {
        type: DataTypes.DATE,
        allowNull: false
    },
});
export {
    DaoOrm,
}