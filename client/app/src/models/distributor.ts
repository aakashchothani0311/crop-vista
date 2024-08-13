import { Profile } from "./account";
import { Company, Demand } from "./company";
import Crop from "./crop";
import { Farmer } from "./farmer";

/* Interface representing a DistProc */
export interface DistProc{
    id: string;
    distributorId: Distributor;
    farmerId: Farmer | string;
    cropId: Crop | string;
    quantity: number;
    distQuote: number;
    iAgreeDist: boolean;
    iAgreeFarmer: boolean;
    status: string,
    contractDate: Date
}

/* Interface representing a DistOffer */
export interface DistOffer{
    id: string;
    distributorId: Distributor;
    companyId: Company | string;
    cropId: Crop | string;
    quantity: number;
    distQuote: number;
    iAgreeDist: boolean;
    iAgreeCompany: boolean;
    status: string,
    contractDate: Date
}

/* Interface representing a distributor */
export interface Distributor {
    id: string;
    userId: string;
    profile: Profile;
    capacity: number;
}
