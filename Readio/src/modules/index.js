import { combineReducers } from 'redux';
import filteringReducer from "./filtering/FilteringModule.js";
import bookSearchSlice from "./postwriting/bookSearchSlice.js";
import curationReducer from "./video/CurationModule.js";


const rootReducers =  combineReducers(
        {
            filtering: filteringReducer,
            curation: curationReducer,
            bookSearch: bookSearchSlice,
        });

export default rootReducers;