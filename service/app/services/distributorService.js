import { Distributor } from '../models/distributor.js';

// Create a new Distributor Profile
export const save = async (newDistributorData) => {
    const distributor = new Distributor(newDistributorData);
    return await distributor.save();
};

// Update a Distributor Profile by ID
export const update = async (distributorId, updateData) => {
    return await Distributor.findByIdAndUpdate(distributorId, updateData, { new: true }).exec();
};

// Get a Distributor Profile by ID
export const getById = async (distributorId) => {
    return await Distributor.findById(distributorId).exec();
};