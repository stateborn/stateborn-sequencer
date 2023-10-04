import { getNumberProperty } from '../application/env-var/env-var-service';

const NodeCache = require( "node-cache" );
export class CacheService {

    private readonly CACHE = new NodeCache( {
        // how long should object live in cache
        // when time passes - object will be marked as "expired"
        stdTTL: getNumberProperty('CACHE_STD_TTL'),
        // how often go through cache and delete "expired" objects
        checkperiod: getNumberProperty('CACHE_CHECKPERIOD') } );

    setToCache(key: string, value: any): void {
        this.CACHE.set(key, value);
    }

    getFromCache(key: string): any | undefined {
        return this.CACHE.get(key);
    }
}