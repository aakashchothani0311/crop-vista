import { DistOffer } from '../models/distributor';
import { post, put, search } from './api-service';

const distOfferAPI = 'distoffers';

/* Fetches a list of Offers from the API */
export const getDistOffers = async (params: {}): Promise<DistOffer[]> => {
    return await search<DistOffer>(distOfferAPI, params) as DistOffer[];
}

/* Creates a new distributor offer by sending a POST request to the API */
export const createDistOffers = async(body: {}): Promise<DistOffer> =>{
    return await post<DistOffer>(distOfferAPI, body);
}

/* Update a distributor offer by sending a PUT request to the API */
export const updateDistOffers = async(id: string, body: {}): Promise<DistOffer> =>{
    return await put<DistOffer>(distOfferAPI, id, body);
}