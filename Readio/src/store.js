import { configureStore } from '@reduxjs/toolkit';
import bookSearchReducer from './components/modules/bookSearchSlice';

export const store = configureStore({
    reducer: {
        bookSearch: bookSearchReducer,
    },
});