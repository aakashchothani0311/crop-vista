import * as distOfferService from '../services/distOfferService.js';
import { setResponse, setError } from './responseHandler.js';

// Fetch all distOffers
export const search = async (req, res) => {
    try {
        const query = {...req.query};

        if(query.status && query.statusCond === 'notEqual'){
            query.status = {$ne: 'Completed'};
            delete query.statusCond;
        }

        const distOffers = await distOfferService.search(query);
        setResponse(distOffers, res);
    } catch (error) {
        setError(error, res);
    }
};

// Create a new distOffer
export const post = async (req, res) => {
    try {
        const newPayload = {...req.body};
        const distOffer = await distOfferService.save(newPayload);
        setResponse(distOffer, res);
    } catch (error) {
        setError(error, res);
    }
};

// Update a distOffer
export const put = async (req, res) => {
    try {
        const distOfferId = req.params.id;
        const payload = {...req.body};
        const distOffer = await distOfferService.update(distOfferId, payload);
        setResponse(distOffer, res);
    } catch (error) {
        setError(error, res);
    }
};