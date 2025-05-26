import { combineReducers } from 'redux';
import bookSearchSlice from "./postwriting/bookSearchSlice.js";
import FilteringSlice from "./filtering/FilteringSlice.js";
import CurationSlice from "./video/CurationSlice.js";
import videoSlice from "./video/VideoSlice.js";
import userReducer from './logout/userReducer.js';


const rootReducers =  combineReducers(
        {
            filtering: FilteringSlice,
            curation: CurationSlice,
            bookSearch: bookSearchSlice,
            video: videoSlice
                        user: userReducer

        });

export default rootReducers;