import Crop from '../models/crop';
import { search } from './api-service';

const cropAPI = 'crops';

/* Fetches a list of crops from the API */
export const getCrops = async (): Promise<Crop[]> => {
    return await search<Crop>(cropAPI, {}) as Crop[];
}