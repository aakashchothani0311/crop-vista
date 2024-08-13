import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import { Supply } from '../models/farmer';

/* Create Slice */
export type SupplyState = Supply[];

export const supplySlice = createSlice({
    name: 'supplies',
    initialState: [] as SupplyState,
    reducers: {
        loadSupplies: (state: SupplyState, action: PayloadAction<SupplyState>) => {
            return [...action.payload];
        }
    }
});

/* Create Actions */
export const { loadSupplies } = supplySlice.actions;

/* Selector */
export const getAllSupplies = (): ((state: AppState) => SupplyState) => {
    return (state: AppState) => state.supplies;
}