import { DistProc } from '../models/distributor';
import { post, put, search } from './api-service';

const distProcAPI = 'distprocs';

/* Fetches a list of Procurements from the API */
export const getDistProcs = async (params: {}): Promise<DistProc[]> => {
    return await search<DistProc>(distProcAPI, params) as DistProc[];
}

/* Creates a new distributor procurements by sending a POST request to the API */
export const createDistProcs = async(body: {}): Promise<DistProc> =>{
    return await post<DistProc>(distProcAPI, body);
}

/* Update a distributor procurement by sending a PUT request to the API */
export const updateDistProc = async(id: string, body: {}): Promise<DistProc> =>{
    return await put<DistProc>(distProcAPI, id, body);
}