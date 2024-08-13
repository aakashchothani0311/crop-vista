import mongoose from 'mongoose';
import addressSchema from './address.js';
import config from './schema-config.js';

const { Schema } = mongoose;

// Profile schema
const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    address: addressSchema,
}, config);

export default profileSchema;