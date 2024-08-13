import mongoose from 'mongoose';
import config from './schema-config.js';

const { Schema } = mongoose;

// Address schema
const addressSchema = new Schema({
    street1: {
        type: String,
        required: true
    },
    street2: String,
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
}, config);

export default addressSchema;