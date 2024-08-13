import { Profile } from './account';
import Crop from './crop';

/* Interface representing a supply */
export interface Supply {
    id: string;
    farmerId: string;
    cropId: Crop;
    quantity: number;
    timeline: number;
    createdDate: Date;
}

/* Interface representing a farmer */
export interface Farmer {
    id: string;
    profile: Profile;
    area: number;
    productionCapacity: number;
}
