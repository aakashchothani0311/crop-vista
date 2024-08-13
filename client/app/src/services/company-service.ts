import { Company } from '../models/company';
import { getById, post, put, search } from './api-service';

const companyAPI = 'companies';


/* Fetches a list of companies from the API */
export const getCompanies = async (): Promise<Company[]> => {
    return await search<Company>(companyAPI, {}) as Company[];
}

/* Creates a new company by sending a POST request to the API */
export const createCompany = async(body: {}): Promise<Company> =>{
    return await post<Company>(companyAPI, body);
}

export const getCompanyById = async (companyId: string): Promise<Company> => {
    return await getById<Company>(companyAPI, companyId) as Company;
}

export const updateCompany = async (companyId: string, body: {}): Promise<Company> => {
    return await put<Company>(companyAPI, companyId, body);
}