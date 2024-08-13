import { Demand } from '../models/company';
import { post, search } from './api-service';

const demandAPI = 'demands';

/* Fetches a list of demands from the API */
export const getDemands = async (params: {}): Promise<Demand[]> => {
    return await search<Demand>(demandAPI, params) as Demand[];
}

/* Creates a new demand by sending a POST request to the API */
export const createDemand = async(body: {}): Promise<Demand> =>{
    return await post<Demand>(demandAPI, body);
}