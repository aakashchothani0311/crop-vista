import * as distributorService from '../services/distributorService.js';
import { setResponse, setError } from './responseHandler.js';

// Create a new distributor Profile
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const distributor = await distributorService.save(newPayload);
        setResponse(distributor, res);
    } catch (error) {
        setError(error, res);
    }
};

// Update a distributor Profile
export const put = async (req, res) => {
    try {
        const distributorId = req.params.id;
        const payload = {...req.body};
        const distributor = await distributorService.update(distributorId, payload);
        setResponse(distributor, res);
    } catch (error) {
        setError(error, res);
    }
};

// Get a distributor Profile by ID
export const get = async (req, res) => {
    try {
        const distributorId = req.params.id;
        const distributor = await distributorService.getById(distributorId);
        setResponse(distributor, res);
    } catch (error) {
        setError(error, res);
    }
};