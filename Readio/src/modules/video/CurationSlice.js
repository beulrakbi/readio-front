import { createSlice } from "@reduxjs/toolkit";

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