import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const filteringSlice = createSlice({
    name: 'filtering',
    initialState,
    reducers: {
        postFilterings: (state, action) => {
            return action.payload;
        },
        putFilterings: (state, action) => {
            return action.payload;
        },
        deleteFiltering: (state, action) => {
            return action.payload;
        },
        deleteFilterings: (state, action) => {
            return action.payload;
        },
        getFilteringGroup: (state, action) => {
            return action.payload;
        },
        getFilteringGroups: (state, action) => {
            return action.payload;
        },
        postFilteringGroup: (state, action) => {
            return action.payload;
        },
        putFilteringGroup: (state, action) => {
            return action.payload;
        },
        deleteFilteringGroup: (state, action) => {
            return action.payload;
        }
    }
});

// 액션과 리듀서 export
export const {
    postFilterings,
    putFilterings,
    deleteFiltering,
    deleteFilterings,
    getFilteringGroup,
    getFilteringGroups,
    postFilteringGroup,
    putFilteringGroup,
    deleteFilteringGroup
} = filteringSlice.actions;

export default filteringSlice.reducer;
