import { DataTypes } from 'sequelize';
import { SEQUELIZE } from '../sequelize-connection-service';

const SequencerOrm = SEQUELIZE.define('sequencer', {
    // Model attributes are defined here
    address: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
}, {
});
SequencerOrm.sync();
export {
    SequencerOrm,
}