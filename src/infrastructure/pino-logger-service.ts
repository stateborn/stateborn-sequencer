import pino from 'pino-http';
import * as fs from 'fs';
import { getProperty } from '../application/env-var/env-var-service';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import pinoms from 'pino-multi-stream';
import pretty from 'pino-pretty';

const logsDirectory = getProperty('LOGS_DIRECTORY');
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

// Create a rotating write stream for logs
const logStream = createStream('file.log', {
    size: '10M', // Log files will rotate when they reach 10MB
    interval: '1d', // Log files will rotate every day
    path: logsDirectory,
});

const streams = [
    { level: 'info', stream: logStream },
    { level: 'info', stream: pretty({ colorize: true })}
];

// @ts-ignore
export const PINO_LOGGER_INSTANCE = pino({}, pinoms.multistream(streams));
export const LOGGER = PINO_LOGGER_INSTANCE.logger;

