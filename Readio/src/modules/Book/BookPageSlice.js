import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    bookIsbn: '',
    bookTitle: '',
    bookAuthor: '',
    bookPublisher: '',
    bookCover: '',
    bookDescription: '',
};

const BookPageSlice = createSlice({
    name:'bookPage',
    initialState,
    reducers: {
        getBook: (state, action) => {
            return {
                bookIsbn: action.payload.bookIsbn,
                bookTitle: action.payload.bookTitle,
                bookAuthor: action.payload.bookAuthor,
                bookPublisher: action.payload.bookPublisher,
                bookCover: action.payload.bookCover,
                bookDescription: action.payload.bookDescription
            }
        },
    }
})

export const {
    getBook
} = BookPageSlice.actions;

export default BookPageSlice.reducer;
