import { post, search } from './api-service';
import { Supply } from '../models/farmer';

const supplyAPI = 'supplies';

/* Fetches a list of supplies from the API */
export const getSupplies = async (params: {}): Promise<Supply[]> => {
    return await search<Supply>(supplyAPI, params) as Supply[];
}

/* Creates a new supply by sending a POST request to the API */
export const createSupply = async(body: {}): Promise<Supply> =>{
    return await post<Supply>(supplyAPI, body);
}