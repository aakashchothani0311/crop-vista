import { Farmer } from '../models/farmer.js';

// Create a new Farmer Profile
export const save = async (newFarmerData) => {
    const farmer = new Farmer(newFarmerData);
    return await farmer.save();
};

// Update a Farmer Profile by ID
export const update = async (farmerId, updateData) => {
    return await Farmer.findByIdAndUpdate(farmerId, updateData, { new: true }).exec();
};

// Get a Farmer Profile by ID
export const getById = async (farmerId) => {
    return await Farmer.findById(farmerId).exec();
};