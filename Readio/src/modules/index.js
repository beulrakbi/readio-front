import { combineReducers } from 'redux';
import filteringReducer from "./filtering/FilteringModule.js";
import bookSearchSlice from "./postwriting/bookSearchSlice.js";


const rootReducers =  combineReducers(
        {
            filtering: filteringReducer,
            bookSearch: bookSearchSlice,
        });

export default rootReducers;