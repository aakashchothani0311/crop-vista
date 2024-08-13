import { Farmer } from '../models/farmer';
import { getById, post, put } from './api-service';

const farmerAPI = 'farmers';

/* Creates a new farmer by sending a POST request to the API */
export const createFarmer = async(body: {}): Promise<Farmer> =>{
    return await post<Farmer>(farmerAPI, body);
}

export const getFarmerById = async (farmerId: string): Promise<Farmer> => {
    return await getById<Farmer>(farmerAPI, farmerId) as Farmer;
}

export const updateFarmer = async (farmerId: string, body:{}): Promise<Farmer> => {
    return await put<Farmer>(farmerAPI, farmerId, body);
}