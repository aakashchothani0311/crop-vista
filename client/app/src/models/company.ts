import { Address, Profile } from './account';
import Crop from './crop';

/* Interface representing a demand */
export interface Demand {
    id: string;
    companyId: string;
    cropId: Crop;
    quantity: number;
    timeline: number;
    createdDate: Date;
}

/* Interface representing a company */
export interface Company {
    id: string;
    profile: Profile;
    shippingAddress: Address;
}
