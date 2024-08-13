import { Account } from "../models/account";
import { post, search } from "./api-service";

const accountAPI = 'accounts';

/* Fetches a list of accounts from the API */
export const getAccount = async (params: {}): Promise<Account> => {
    return await search<Account>(accountAPI, params) as Account;
}

/* Creates a new account by sending a POST request to the API */
export const createAccount = async (params: {}): Promise<Account> => {
    return await post<Account>(accountAPI, params) as Account;
}