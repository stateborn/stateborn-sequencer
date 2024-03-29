import { getBooleanProperty, getProperty } from './env-var/env-var-service';

export const ARBITRUM_CHAIN_ID = '42161';
export const ETHEREUM_MAINNET_CHAIN_ID = '1';
export const POLYGON_MAINNET_CHAIN_ID = '137';
export const DEVELOPMENT_NETWORK_CHAIN_ID = getProperty('DEVELOPMENT_NETWORK_CHAIN_ID');
export const SUPPORTED_CHAIN_IDS = getBooleanProperty('IS_DEVELOPMENT_MODE') ?
    [ETHEREUM_MAINNET_CHAIN_ID, ARBITRUM_CHAIN_ID, POLYGON_MAINNET_CHAIN_ID, DEVELOPMENT_NETWORK_CHAIN_ID] :
    [ETHEREUM_MAINNET_CHAIN_ID, ARBITRUM_CHAIN_ID, POLYGON_MAINNET_CHAIN_ID];