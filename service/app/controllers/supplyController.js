import * as supplyService from '../services/supplyService.js';
import { setResponse, setError } from './responseHandler.js';

// Fetch all supplies
export const search = async (req, res) => {
    try {
        const query = {...req.query};
        const supplies = await supplyService.search(query);
        setResponse(supplies, res);
    } catch (error) {
        setError(error, res);
    }
};

// Create a new supply
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const supply = await supplyService.save(newPayload);
        setResponse(supply, res);
    } catch (error) {
        setError(error, res);
    }
};