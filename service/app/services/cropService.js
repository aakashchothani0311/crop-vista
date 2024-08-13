import Crop from '../models/crop.js';

// Get all crop
export const search = async () => {
    return await Crop.find().exec();
};