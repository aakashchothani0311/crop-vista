import { Demand } from '../models/company.js';

// Get all demand
export const search = async (query = {}) => {
    return await Demand.find(query).populate('cropId').exec();
};

// Create a new demand
export const save = async (newdemandData) => {
    const demand = new Demand(newdemandData);
    return await demand.save();
};