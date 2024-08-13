import { DistProc } from '../models/distributor.js';

// Get all distributor Procurements
export const search = async (query = {}) => {
    return await DistProc.find(query)
    .populate('distributorId')
    .populate('farmerId')
    .populate('cropId')
    .exec();
};

// Create a new distributor Procurement
export const save = async (newDistProcData) => {
    const distProc = new DistProc(newDistProcData);
    return await distProc.save();
};

// Update a distributor Procurement by ID
export const update = async (distProcId, updateData) => {
    return await DistProc.findByIdAndUpdate(distProcId, updateData, { new: true }).exec();
};