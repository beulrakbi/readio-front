import { createSlice } from '@reduxjs/toolkit';

const BookSlice = createSlice({
  name: 'books',
  initialState: {
    bookList: [],              //  도서 리스트 저장
    totalResults: 0,           //  전체 검색 결과 수 저장
    startIndex: 1,             //  현재 페이지 시작 인덱스 저장
    itemsPerPage: 10           //  페이지당 아이템 수 저장
  },
  reducers: {
    getBooks: (state, action) => {
      // payload 전체 응답 객체를 구조분해하여 저장
      const { item, totalResults, startIndex, itemsPerPage } = action.payload;
      state.bookList    = item           || [];        // item 배열로 설정
      state.totalResults = totalResults  || 0;         // totalResults 저장
      state.startIndex   = startIndex    || state.startIndex;   // startIndex 저장
      state.itemsPerPage = itemsPerPage  || state.itemsPerPage; // itemsPerPage 저장
    },
    postBook: (state, action) => {
      state.bookList.push(action.payload); // 도서 하나를 리스트에 추가
    },
  }
});

export const { getBooks, postBook } = BookSlice.actions;
export default BookSlice.reducer;
