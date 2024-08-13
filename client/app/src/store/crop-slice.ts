import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '.';
import Crop from '../models/crop';

export type CropState = Crop[];

/* Create a slice of the Redux store for managing crop state */
export const cropSlice = createSlice({
    name: 'crops',
    initialState: [] as CropState,
    reducers: {
        loadCrops: (state: CropState, action: PayloadAction<CropState>) => {
            return [...action.payload];
        }
    }
});

/* Create Actions */
export const { loadCrops } = cropSlice.actions;

/* Selector to access all crops from the Redux store */
export const getAllCrops = (): ((state: AppState) => CropState) => {
    return (state: AppState) => state.crops;
}

/* // Selector to find a crop by its name and grade */
export const getCropByName = (name: string): ((state: AppState) => Crop | {}) => {
    return (state: AppState): Crop | {} => {
        if(name){
            const [cropName, grade] = name.split(' - ');
            return state.crops.filter(c => c.name === cropName && c.grade === grade)[0];
        }
        return {};  
    };
};

export const getCropById = (id: string): ((state: AppState) => Crop | {}) => {
    return (state: AppState): Crop | {} => {
        if(id){
            return state.crops.filter(c => c.id === id)[0];
        }
        return {};  
    };
}; 