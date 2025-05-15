import { configureStore } from '@reduxjs/toolkit';
import bookSearchReducer from './components/modules/postwriting/bookSearchSlice';

export const store = configureStore({
    reducer: {
        bookSearch: bookSearchReducer,
    },
});