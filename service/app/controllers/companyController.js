import * as companyService from '../services/companyService.js';
import { setResponse, setError } from './responseHandler.js';

// Create a new company Profile
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const company = await companyService.save(newPayload);
        setResponse(company, res);
    } catch (error) {
        setError(error, res);
    }
};

// Update a company Profile
export const put = async (req, res) => {
    try {
        const companyId = req.params.id;
        const payload = {...req.body};
        const company = await companyService.update(companyId, payload);
        setResponse(company, res);
    } catch (error) {
        setError(error, res);
    }
};

// Get a company Profile by ID
export const get = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await companyService.getById(companyId);
        setResponse(company, res);
    } catch (error) {
        setError(error, res);
    }
};