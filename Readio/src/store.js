import { configureStore } from '@reduxjs/toolkit';
import rootReducers from './modules';
import bookSearchReducer from './modules/postwriting/bookSearchSlice';

export const store = configureStore({
    reducer: {
        bookSearch: bookSearchReducer,
        rootReducers,
    },
});