import { DistOffer } from '../models/distributor.js';

// Get all Distributor Offer
export const search = async (query = {}) => {
    return await DistOffer.find(query)
    .populate('distributorId')
    .populate('companyId')
    .populate('cropId')
    .exec();
};

// Create a new DistributorS Offer
export const save = async (newDistOfferData) => {
    const distOffer = new DistOffer(newDistOfferData);
    return await distOffer.save();
};

// Update a Distributor Offer by ID
export const update = async (distOfferId, updateData) => {
    return await DistOffer.findByIdAndUpdate(distOfferId, updateData, { new: true }).exec();
};