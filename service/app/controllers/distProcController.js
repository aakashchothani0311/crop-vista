import * as distProcService from '../services/distProcService.js';
import { setResponse, setError } from './responseHandler.js';

// Fetch all Distributor Procurements
export const search = async (req, res) => {
    try {
        const query = {...req.query};

        if(query.status && query.statusCond === 'notEqual'){
            query.status = {$ne: 'Completed'};
            delete query.statusCond;
        }

        const distProcs = await distProcService.search(query);
        setResponse(distProcs, res);
    } catch (error) {
        setError(error, res);
    }
};

// Create a new Distributor Procurement
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const distProc = await distProcService.save(newPayload);
        setResponse(distProc, res);
    } catch (error) {
        setError(error, res);
    }
};

// Update a Distributor Procurement
export const put = async (req, res) => {
    try {
        const distProcId = req.params.id;
        const payload = {...req.body};
        const distProc = await distProcService.update(distProcId, payload);
        setResponse(distProc, res);
    } catch (error) {
        setError(error, res);
    }
};