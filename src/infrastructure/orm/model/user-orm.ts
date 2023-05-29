import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';

const UserOrm = SEQUELIZE.define('user', {
    // Model attributes are defined here
    address: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
}, {
});
UserOrm.sync();
export {
    UserOrm,
}