import pino from 'pino-http';

export const PINO_LOGGER_INSTANCE = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        }
    }
});
export const LOGGER = PINO_LOGGER_INSTANCE.logger;

