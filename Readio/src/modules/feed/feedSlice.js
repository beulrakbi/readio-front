import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // 또는 fetch API

// API 호출 함수 (여기서는 createAsyncThunk로 정의)
export const getFeedItemsAPI = createAsyncThunk(
    'feed/getFeedItems',
    async (params, { rejectWithValue }) => {
        try {
            // 로그인 여부 (localstorage 등에서 토큰 확인)
            const token = localStorage.getItem('accessToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // 백엔드 API URL
            const baseUrl = 'http://localhost:8080/feed'; // 직접 명시
            const queryParams = new URLSearchParams(params).toString(); // params를 쿼리 스트링으로 변환

            const response = await axios.get(`<span class="math-inline">\{baseUrl\}?</span>{queryParams}`, { headers });
            return response.data.data; // ResponseDTO의 data 필드 반환
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
            // 탭 변경 시 기존 데이터 초기화 (새로운 검색 시작)
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
                state.items = action.payload.currentPage === 0
                            ? action.payload.items
                            : [...state.items, ...action.payload.items]; // 더보기 시 기존 데이터에 추가
                state.currentPage = action.payload.currentPage;
                state.totalElements = action.payload.totalElements;
                state.isLast = action.payload.isLast;
            })
            .addCase(getFeedItemsAPI.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { setFeedTabs } = feedSlice.actions;
export default feedSlice.reducer;