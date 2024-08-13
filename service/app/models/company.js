import mongoose from 'mongoose';
import addressSchema from './address.js';
import config from './schema-config.js';
import profileSchema from './profile.js';

const { Schema } = mongoose;

// Mongoose schema for the 'Demand' collection
const demandSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'company',
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

// Mongoose schema for the 'company' collection
const companySchema = new Schema({
    profile: profileSchema,
    shippingAddress: addressSchema
}, config);

export const Company = mongoose.model('company', companySchema);
export const Demand = mongoose.model('demand', demandSchema);