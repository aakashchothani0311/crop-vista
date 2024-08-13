import * as cropService from '../services/cropService.js';
import { setResponse, setError } from './responseHandler.js';

// Fetch all crops
export const search = async (req, res) => {
    try {
        const crops = await cropService.search();
        setResponse(crops, res);
    } catch (error) {
        setError(error, res);
    }
};