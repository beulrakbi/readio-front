import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    type: [],
    keywords: [],
    status: null,
    message: null,
};

const curationSlice = createSlice({
    name: 'curation',
    initialState,
    reducers: {
        getCurationTypes: (state, action) => {
            state.type = action.payload.data;
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
        getCurationKeywords: (state, action) => {
            state.keywords = action.data;
            state.status = action.status;
            state.message = action.message;
        },
        getAllCuration: (state, action) => {
            state.type = action.payload.data;
            state.keywords = action.data;
        }
    }
});


export const {
    getCurationKeywords, getCurationTypes
} = curationSlice.actions;

export default curationSlice.reducer;