import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const getFeedItemsAPI = createAsyncThunk(
    'feed/getFeedItems',
    async (params, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('accessToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const baseUrl = 'http://localhost:8080/feed';
            const queryParams = new URLSearchParams(params).toString();

            const response = await axios.get(`${baseUrl}?${queryParams}`, { headers });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || '피드를 불러오는 데 실패했습니다.');
        }
    }
);

const feedSlice = createSlice({
    name: 'feed',
    initialState: {
        items: [],
        currentPage: 0,
        totalElements: 0,
        isLast: false,
        isLoading: false,
        error: null,
        activeMainTab: 'rec', // 현재 선택된 메인 탭
        activeSubTab: 'all',  // 현재 선택된 서브 탭
    },
    reducers: {
        setFeedTabs: (state, action) => {
            state.activeMainTab = action.payload.mainTab;
            state.activeSubTab = action.payload.subTab;
            state.items = [];
            state.currentPage = 0;
            state.totalElements = 0;
            state.isLast = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeedItemsAPI.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeedItemsAPI.fulfilled, (state, action) => {
                state.isLoading = false;

                const receivedItems = action.payload.feedItems || [];
                const receivedCurrentPage = action.payload.currentPage || 0;
                const receivedTotalElements = action.payload.totalElements || 0;
                const receivedIsLast = action.payload.last === true;

                state.items = action.payload.currentPage === 0
                            ? receivedItems
                            : [...state.items, ...receivedItems];
                state.currentPage = receivedCurrentPage;
                state.totalElements = receivedTotalElements;
                state.isLast = receivedIsLast;
            })
            .addCase(getFeedItemsAPI.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.items = [];
                state.currentPage = 0;
                state.isLast = true;
            });
    }
});

export const { setFeedTabs } = feedSlice.actions;
export default feedSlice.reducer;