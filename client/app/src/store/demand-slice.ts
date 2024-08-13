import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { Demand } from '../models/company';

// Create Slice
export type DemandState = Demand[];

/* Create a slice of the Redux store for managing demand state */
export const demandSlice = createSlice({
    name: 'demands',
    initialState: [] as DemandState,
    reducers: {
        loadDemands: (state: DemandState, action: PayloadAction<DemandState>) => {
            return [...action.payload];
        }
    }
});

/* Create Actions */
export const { loadDemands } = demandSlice.actions;

/* Selector to access all demands from the Redux store */
export const getAllDemands = (): ((state: AppState) => DemandState) => {
    return (state: AppState) => state.demands;
}