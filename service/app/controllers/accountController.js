import * as accountService from '../services/accountService.js';
import { setResponse, setError } from './responseHandler.js';

// Search accounts by username
export const search = async (req, res) => {
    try {
        const query = {...req.query};
        const accounts = await accountService.search(query);
        setResponse(accounts, res);
    } catch (error) {
        setError(error, res);
    }
};

// Create a new user Account
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const { username, role, child } = await accountService.save(newPayload);
        setResponse({username, role, child}, res);
    } catch (error) {
        setError(error, res);
    }
};