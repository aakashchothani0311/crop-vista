import mongoose from 'mongoose';
import config from './schema-config.js';

const { Schema } = mongoose;

// Mongoose schema for the 'account' collection
const accountSchema = new Schema({ 
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    child: {
        type: Schema.Types.ObjectId,
        refPath: 'role',
        unique: true
    },
    profilePic: String
}, config);

const Account = mongoose.model('account', accountSchema);
export default Account;