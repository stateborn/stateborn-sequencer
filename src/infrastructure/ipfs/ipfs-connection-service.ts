import { create } from 'ipfs-http-client';
import { getProperty } from '../../application/env-var/env-var-service';

export const IPFS_CLIENT = create({ host: getProperty('IPFS_HOST'), port: Number(getProperty('IPFS_PORT')), protocol: 'http' });