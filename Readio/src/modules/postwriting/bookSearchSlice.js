import { createSlice } from '@reduxjs/toolkit';
import { searchAladinBooks } from './bookSearchThunk';

const initialState = {
    searchResults: [],
    currentQuery: '',       // 현재 UI에 입력된 검색어 (API 요청 시 사용)
    currentSearchType: 'Title', // 현재 UI에 선택된 검색 타입
    lastSuccessfulQuery: '', // 마지막으로 성공한 검색어 (페이징 시 사용)
    lastSuccessfulSearchType: 'Title', // 마지막으로 성공한 검색 타입
    currentPage: 1,
    totalResults: 0,
    isLastPage: false,
    isLoading: false,
    error: null,
};

const bookSearchSlice = createSlice({
    name: 'bookSearch',
    initialState,
    reducers: {
        // UI에서 검색어/타입 변경 시 호출될 리듀서
        setQuery: (state, action) => {
            state.currentQuery = action.payload;
        },
        setType: (state, action) => {
            state.currentSearchType = action.payload;
        },
        // 새 검색 시작 전 상태 초기화 (선택적)
        resetSearch: (state) => {
            state.searchResults = [];
            state.currentPage = 1;
            state.totalResults = 0;
            state.isLastPage = false;
            state.error = null;
            // currentQuery와 currentSearchType은 UI 입력을 따르므로 여기서 초기화하지 않을 수 있음
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchAladinBooks.pending, (state) => {
                state.isLoading = true;
                state.error = null; // 새 요청 시 이전 에러 초기화
            })
            .addCase(searchAladinBooks.fulfilled, (state, action) => {
                state.isLoading = false;
                const { items, meta, loadMore, query, searchType } = action.payload;

                if (loadMore) { // 더보기 요청 성공 시
                    state.searchResults = [...state.searchResults, ...items];
                } else { // 새 검색 요청 성공 시
                    state.searchResults = items;
                    state.lastSuccessfulQuery = query; // 성공한 검색어/타입 기록
                    state.lastSuccessfulSearchType = searchType;
                }
                state.currentPage = meta.currentPage;
                state.totalResults = meta.totalResults;
                state.isLastPage = meta.isEnd;
                state.error = null; // 성공 시 에러 없음
            })
            .addCase(searchAladinBooks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ? action.payload.message : '책 검색에 실패했습니다.';
                // 실패 시, 이전 검색 결과는 그대로 두거나 초기화할 수 있음
                // state.searchResults = [];
                // state.totalResults = 0;
                // state.isLastPage = true;
                console.error("Search Rejected:", action.payload);
            });
    }
});

export const { setQuery, setType, resetSearch } = bookSearchSlice.actions;
export default bookSearchSlice.reducer;