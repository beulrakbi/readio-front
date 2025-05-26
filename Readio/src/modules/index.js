import { combineReducers } from 'redux';
import bookSearchSlice from "./postwriting/bookSearchSlice.js";
import FilteringSlice from "./filtering/FilteringSlice.js";
import CurationSlice from "./video/CurationSlice.js";
import videoSlice from "./video/VideoSlice.js";


const rootReducers =  combineReducers(
        {
            filtering: FilteringSlice,
            curation: CurationSlice,
            bookSearch: bookSearchSlice,
            video: videoSlice
        });

export default rootReducers;