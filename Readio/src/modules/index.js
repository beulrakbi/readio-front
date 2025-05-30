import { combineReducers } from 'redux';
import FilteringSlice from "./filtering/FilteringSlice.js";
import bookSearchSlice from "./postwriting/bookSearchSlice.js";
import postReducer from "./postwriting/PostModule.js";
import postReviewReducer from "./postwriting/PostReviewModule.js";
import userReducer from './user/userSlice.js';
import CurationSlice from "./video/CurationSlice.js";
import videoSlice from "./video/VideoSlice.js";
import BookPageSlice from "./Book/BookPageSlice.js";


const rootReducers =  combineReducers(
        {
            postReviewReducer,
            postReducer,
            filtering: FilteringSlice,
            curation: CurationSlice,
            bookSearch: bookSearchSlice,
            video: videoSlice,
            user: userReducer,
            bookPage: BookPageSlice,
        });

export default rootReducers;