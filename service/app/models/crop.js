import mongoose from 'mongoose';
import config from './schema-config.js';

const { Schema } = mongoose;

// Mongoose schema for the 'crop' collection
const cropSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    msp: Number
}, config);

const Crop = mongoose.model('crop', cropSchema);
export default Crop;