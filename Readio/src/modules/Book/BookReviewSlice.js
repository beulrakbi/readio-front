import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    reviews: [],
    status: null,
    message: null
};


const BookReviewSlice = createSlice({
    name: 'bookReview',
    initialState,
    reducers: {
        getBookReviews: (state, action) => {
            state.reviews = action.payload.data;
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
        putReportingReview: (state, action) => {
            state.reviews = action.payload.data;
            state.status = action.payload.status;
            state.message = action.payload.message;
        }
    }
});

export const {
    getBookReviews, putReportingReview
} = BookReviewSlice.actions;

export default BookReviewSlice.reducer;
