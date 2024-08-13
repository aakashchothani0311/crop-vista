import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { Farmer } from '../models/farmer';
import { Company } from '../models/company';
import { Distributor } from '../models/distributor';

/* Define a union type for all profile types */
export type ProfileState = Farmer | Company | Distributor;

/* Create the slice */
export const profileSlice = createSlice({
    name: 'profile',
    initialState: {} as ProfileState,
    reducers: {
        loadProfile: (state: ProfileState, action: PayloadAction<ProfileState>) => {
            return { ...action.payload };
        }
    }
});

/* Create Actions */
export const { loadProfile } = profileSlice.actions;

/* Selector */
export const getProfile = (state: AppState) => state.profile;