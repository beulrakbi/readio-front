import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    status: null,
    message: null,
};

const ReportedReviewSlice = createSlice({
    name:'reportedReview',
    initialState,
    reducers: {
        getReportedReviews: (state, action) => {
            return {
                ...state,
                data: action.payload.data, // result.data가 아닌 payload 직접 접근
                state: action.payload.state,
                message: action.payload.message
            };
        }
    }
});

export const {
    getReportedReviews
} = ReportedReviewSlice.actions;

export default ReportedReviewSlice.reducer;
