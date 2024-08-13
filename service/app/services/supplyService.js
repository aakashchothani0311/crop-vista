import { Supply } from '../models/farmer.js';

// Get all supplies
export const search = async (query = {}) => {
    return await Supply.find(query).populate('cropId').exec();
};

// Create a new supply
export const save = async (newsupplyData) => {
    const supply = new Supply(newsupplyData);
    return await supply.save();
};