import { Company } from '../models/company.js';

// Create a new company Profile
export const save = async (newcompanyData) => {
    const company = new Company(newcompanyData);
    return await company.save();
};

// Update a company Profile by ID
export const update = async (companyId, updateData) => {
    return await Company.findByIdAndUpdate(companyId, updateData, { new: true }).exec();
};

// Get a company Profile by ID
export const getById = async (companyId) => {
    return await Company.findById(companyId).exec();
};