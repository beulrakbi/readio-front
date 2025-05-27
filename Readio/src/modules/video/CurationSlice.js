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
            state.type = action.payload.data.map(item => ({
                type: item.curationType
            }));
            state.keywords = action.payload.data.map(item => ({
                keywords:item.curationKeywords
            }));
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
        putCurationType: (state, action) => {
            state.type = action.payload.data;
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
        postCurationKeywords: (state, action) => {
            state.keywords = action.payload.data;
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
        deleteCurationKeywords: (state, action) => {
            state.keywords = action.payload.data;
            state.status = action.payload.status;
            state.message = action.payload.message;
        }
    }
});


export const {
    getCurationKeywords, getCurationTypes, getAllCuration
    ,putCurationType , postCurationKeywords, deleteCurationKeywords
} = curationSlice.actions;

export default curationSlice.reducer;