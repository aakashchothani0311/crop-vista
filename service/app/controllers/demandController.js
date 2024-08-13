import * as demandService from '../services/demandService.js';
import { setResponse, setError } from './responseHandler.js';

// Fetch all demands
export const search = async (req, res) => {
    try {
        const query = {...req.query};
        const demands = await demandService.search(query);
        setResponse(demands, res);
    } catch (error) {
        setError(error, res);
    }
};

// Create a new demand
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const demand = await demandService.save(newPayload);
        setResponse(demand, res);
    } catch (error) {
        setError(error, res);
    }
};