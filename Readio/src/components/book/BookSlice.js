
import { createSlice } from '@reduxjs/toolkit';

const BookSlice = createSlice({
    name : 'books',
    initialState : {
        bookList : [],
    },
    reducers : {
        getBooks : (state, action) => {
            state.bookList = action.payload.item;
        },
        postBook : (state, action) => {
            state.bookList.push(action.payload);
        }
    }
});

export const {getBooks, postBook} = BookSlice.actions;
export default BookSlice.reducer;