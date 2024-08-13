import { Distributor } from '../models/distributor';
import { getById, post, put } from './api-service';

const distributorAPI = 'distributors';

/* Creates a new distributor by sending a POST request to the API */
export const createDistributor = async(body: {}): Promise<Distributor> =>{
    return await post<Distributor>(distributorAPI, body);
}

export const getDistributorById = async (distributorId: string): Promise<Distributor> => {
    return await getById<Distributor>(distributorAPI, distributorId) as Distributor;
}

export const updateDist = async (distId: string, body:{}): Promise<Distributor> => {
    return await put<Distributor>(distributorAPI, distId, body);
}