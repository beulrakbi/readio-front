<<<<<<< HEAD
import { createSlice } from "@reduxjs/toolkit";
=======
import {createSlice} from "@reduxjs/toolkit";
>>>>>>> ed0b1c798eb1e3b5fa11fec6c8e6cf895339cacb

const initialState = {
    data: []
};

const curationSlice = createSlice({
    name: 'curation',
    initialState,
    reducers: {
        getCurationKeywords: (state, action) => {
            return {
                ...state,
                keywords: action.data,
                status: action.status,
                message: action.message
            };
        }
    }
});

export const {
    getCurationKeywords
} = curationSlice.actions;

export default curationSlice.reducer;