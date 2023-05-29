import { Sequelize } from 'sequelize';
import { getProperty } from '../../application/env-var/env-var-service';

const SEQUELIZE = new Sequelize(`postgres://${getProperty('DB_USER')}:${getProperty('DB_PASSWORD')}@${getProperty('DB_HOST')}:${getProperty('DB_PORT')}/${getProperty('DB_NAME')}`) // Example for postgres
const connectToDb = async () => {
    try {
        await SEQUELIZE.authenticate();
        console.log('Connection to DB has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to DB:', error);
        throw error;
    }
};

export {
    SEQUELIZE,
    connectToDb,
}