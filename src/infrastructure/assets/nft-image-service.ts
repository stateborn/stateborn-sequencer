import axios from 'axios';
import { LOGGER } from '../pino-logger-service';

export class NftImageService {
    async fetchImageToBase64(uri: string): Promise<string | undefined> {
        if (uri.startsWith('https://') || uri.startsWith('http://')) {
            const resp = await axios.get(uri, {responseType: 'arraybuffer'});
            return resp.data.toString('base64');
        } else {
            LOGGER.warn(`Unsupported URI scheme: ${uri} for fetching NFT image!`);
            return undefined;
        }
    }
}