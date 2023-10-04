import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../../sequelize-connection-service';

const NftOrm = SEQUELIZE.define('nft', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // generate UUIDV4 as default
        primaryKey: true,
    },
    nft_token_id: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    token_uri: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    token_metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    token_metadata_hash: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_base64: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    thumbnail_image_base64: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    indexes: [
        {
            name: 'nft_token_id_nft_token_id_index',
            fields: ['token_id', 'nft_token_id'],
        },
    ]

});


export {
    NftOrm,
}
