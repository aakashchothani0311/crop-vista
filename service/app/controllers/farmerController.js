import * as farmerService from '../services/farmerService.js';
import { setResponse, setError } from './responseHandler.js';

// Create a new farmer Profile
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const farmer = await farmerService.save(newPayload);
        setResponse(farmer, res);
    } catch (error) {
        setError(error, res);
    }
};

// Update a farmer Profile
export const put = async (req, res) => {
    try {
        const farmerId = req.params.id;
        const payload = {...req.body};
        const farmer = await farmerService.update(farmerId, payload);
        console.log('farmer', farmer);
        setResponse(farmer, res);
    } catch (error) {
        setError(error, res);
    }
};

// Get a farmer Profile by ID
export const get = async (req, res) => {
    try {
        const farmerId = req.params.id;
        const farmer = await farmerService.getById(farmerId);
        setResponse(farmer, res);
    } catch (error) {
        setError(error, res);
    }
};