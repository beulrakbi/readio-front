import { combineReducers } from 'redux';
import filteringReducer from "./FilteringModule.js";



const rootReducers =  combineReducers(
        {
            filteringReducer
        });

export default rootReducers;