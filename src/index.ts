import "reflect-metadata";
import { connectToDb } from './infrastructure/orm/sequelize-connection-service';
import { initializeAwilixDI } from './infrastructure/di/awilix-config-service';

import { createExpressServer } from 'routing-controllers';
import { LOGGER, PINO_LOGGER_INSTANCE } from './infrastructure/pino-logger-service';
import { syncOrm } from './infrastructure/orm/sequelize-init-service';

const main = async () => {
    initializeAwilixDI();
    await connectToDb();
    await syncOrm();
    // creates express app, registers all controller routes and returns you express app instance
    const app = createExpressServer({
        controllers: [`${__dirname}/interfaces/**/*`],
    });
    app.use(PINO_LOGGER_INSTANCE);

    app.listen(8000, () => {
        LOGGER.info('Started stateborn-sequencer!');
    });
}
main();