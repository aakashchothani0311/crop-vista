import mongoose from 'mongoose';
import profileSchema from './profile.js';
import addressSchema from './address.js';
import config from './schema-config.js';

const { Schema } = mongoose;

// Schema for distributorProcurement
const distProcSchema = new Schema({
    distributorId: {
        type: Schema.Types.ObjectId,
        ref: 'distributor',
        required: true
    },
    farmerId: {
        type: Schema.Types.ObjectId,
        ref: 'farmer',
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
    distQuote: {
        type: Number,
        required: true
    },
    iAgreeDist: Boolean,
    iAgreeFarmer: Boolean,
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    contractDate: Date
}, config);

// Schema for distributorOffer
const distOfferSchema = new Schema({
    distributorId: {
        type: Schema.Types.ObjectId,
        ref: 'distributor',
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'company',
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
    distQuote: {
        type: Number,
        required: true
    },
    iAgreeDist: Boolean,
    iAgreeCompany: Boolean,
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    contractDate: Date
}, config);

// Mongoose schema for the 'distributor' collection
const distributorSchema = new Schema({
    profile: profileSchema,
    inventoryCapacity: Number,
    shippingAddress: addressSchema
}, config);

export const Distributor = mongoose.model('distributor', distributorSchema);
export const DistProc = mongoose.model('distProc', distProcSchema);
export const DistOffer = mongoose.model('distOffer', distOfferSchema);