import { combineReducers } from 'redux';
import filteringReducer from "./filtering/FilteringModule.js";
import bookSearchSlice from "./postwriting/bookSearchSlice.js";
import postReducer from "./postwriting/PostModule.js";


const rootReducers =  combineReducers(
        {
            postReducer,
            filtering: filteringReducer,
            bookSearch: bookSearchSlice,
            
        });

export default rootReducers;