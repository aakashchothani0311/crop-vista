/* Interface representing an address */
export interface Address {
    id?: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

/* Interface representing user profile */
export interface Profile {
    id: string;
    name: string;
    email: string;
    address?: Address;
}

/* Interface representing user account */
export interface Account {
    id: string;
    username: string;
    child: string;
    role: string;
    profilePic?: string;
}
