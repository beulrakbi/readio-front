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
            state.keywords = action.payload.data;
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
        getAllCuration: (state, action) => {
            state.curations = action.payload.data.map(item => ({
                type: item.curationType,
                keywords: item.curationKeywords
            }));

            state.status = action.payload.status;
            state.message = action.payload.message;
        }
    }
});


export const {
    getCurationKeywords, getCurationTypes, getAllCuration
} = curationSlice.actions;

export default curationSlice.reducer;