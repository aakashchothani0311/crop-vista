import Account from '../models/account.js';

// Get all Users Accounts
export const search = async (query = {}) => {
    return await Account.findOne(query).select('id username role child profilePic').exec();
};

// Create a new User Account
export const save = async (newAccountData) => {
    const account = new Account(newAccountData);
    return await account.save();
};

// Update a User Account by ID
export const update = async (accountId, updateData) => {
    return await Account.findByIdAndUpdate(accountId, updateData, { new: true }).exec();
};

// Get a User Account by ID
export const getById = async (accountId) => {
    return await Account.findById(accountId).populate('child').exec();
};