import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userReducer/userSlice';
import  localStorageMiddleware from './localStorageMiddleware';

const store = configureStore({
    reducer: {
        users: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
