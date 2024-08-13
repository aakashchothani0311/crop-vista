import mongoose from 'mongoose';
import config from './schema-config.js';
import profileSchema from './profile.js';

const { Schema } = mongoose;

// Mongoose schema for the 'supply' collection
const supplySchema = new Schema({
    farmerId: {
        type: Schema.Types.ObjectId,
        ref: 'farmer',
        required: true
    },
    cropId: {
        type: Schema.Types.ObjectId,
        ref: 'crop',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    timeline: {
        type: Number,
        required: true
    },
    createdDate : {
        type: Date,
        default: Date,
    }
}, config);

// Mongoose schema for the 'Farmer' collection
const farmerSchema = new Schema({
    profile: profileSchema,
    area: Number,
    productionCapacity: Number
}, config);

export const Farmer = mongoose.model('farmer', farmerSchema);
export const Supply = mongoose.model('supply', supplySchema);