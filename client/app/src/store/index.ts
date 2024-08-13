import { configureStore } from '@reduxjs/toolkit';
import { profileSlice } from './profile-slice'; 
import { supplySlice } from './supply-slice';
import { demandSlice } from './demand-slice';
import { cropSlice } from './crop-slice';

/* Configure the Redux store with the specified reducers */
export const store = configureStore({
    reducer: {
        [profileSlice.name]: profileSlice.reducer,
        [cropSlice.name]: cropSlice.reducer,
        [demandSlice.name]: demandSlice.reducer,
        [supplySlice.name]: supplySlice.reducer
    }
});

/* Define types for the store, state, and dispatch */
export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;