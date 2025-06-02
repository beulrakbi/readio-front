import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    status: null,
    message: null,
};

const ReportedSlice = createSlice({
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
        },
        getReportedReview: (state, action) => {
            return {
                data: action.payload.data, // result.data가 아닌 payload 직접 접근
                state: action.payload.state,
                message: action.payload.message
            }
        },
        putReportedReview: (state, action) => {
            return {
                data: action.payload.data, // result.data가 아닌 payload 직접 접근
                state: action.payload.state,
                message: action.payload.message
            }
        },
        getReportedPosts: (state, action) => {
            return {
                ...state,
                data: action.payload.data, // result.data가 아닌 payload 직접 접근
                state: action.payload.state,
                message: action.payload.message
            };
        },
        getReportedPost: (state, action) => {
            return {
                data: action.payload.data, // result.data가 아닌 payload 직접 접근
                state: action.payload.state,
                message: action.payload.message
            }
        },
        putReportedPost: (state, action) => {
            return {
                data: action.payload.data, // result.data가 아닌 payload 직접 접근
                state: action.payload.state,
                message: action.payload.message
            }
        }
    }
});

export const {
    getReportedReviews, getReportedReview, putReportedReview
    ,getReportedPosts, getReportedPost, putReportedPost
} = ReportedSlice.actions;

export default ReportedSlice.reducer;
