// default env vars values if not overriden
export default {
    DB_USER: 'postgres',
    DB_PASSWORD: 'postgres',
    DB_HOST: 'localhost',
    DB_PORT: '5435',
    DB_NAME: 'sequencer',
    IPFS_HOST: '127.0.0.1',
    IPFS_PORT: '5001',
    LOGS_DIRECTORY: './logs',
    IS_DEVELOPMENT_MODE: 'true',
    DEVELOPMENT_NETWORK_RPC: 'http://127.0.0.1:7545/',
    DEVELOPMENT_NETWORK_CHAIN_ID: '1337',
    DEVELOPMENT_NETWORK_NAME: 'Ganache network',
    DEVELOPMENT_NETWORK_PRIVATE_KEY: '0xb2b041118ae32d6aab5e018c41e7ebe28b765e49ab373a8daacda343658d41c7',
}