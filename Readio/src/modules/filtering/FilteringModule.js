
import {createAction, handleActions} from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_FILTERING = 'filtering/GET_FILTERING';
export const GET_FILTERINGS = 'filtering/GET_FILTERINGS';
export const POST_FILTERING = 'filtering/POST_FILTERING';
export const POST_FILTERINGS = 'filtering/POST_FILTERINGS';
export const PUT_FILTERINGS = 'filtering/PUT_FILTERINGS';
export const DELETE_FILTERING = 'filtering/DELETE_FILTERING';
export const DELETE_FILTERINGS = 'filtering/DELETE_FILTERINGS';

export const GET_FILTERINGGROUP = 'filtering/GET_FILTERINGGROUP';
export const POST_FILTERINGGROUP = 'filtering/POST_FILTERINGGROUP';
export const PUT_FILTERINGGROUP = 'filtering/PUT_FILTERINGGROUP';
export const DELETE_FILTERINGGROUP = 'filtering/DELETE_FILTERINGGROUP';

const action = createAction( {
    [GET_FILTERING]: () => {},
    [GET_FILTERINGS]: () => {},
    [POST_FILTERING]: () => {},
    [POST_FILTERINGS]: () => {},
    [PUT_FILTERINGS]: () => {},
    [DELETE_FILTERING]: () => {},
    [DELETE_FILTERINGS]: () => {},
    [GET_FILTERINGGROUP]: () => {},
    [POST_FILTERINGGROUP]: () => {},
    [PUT_FILTERINGGROUP]: () => {},
    [DELETE_FILTERINGGROUP]: () => {}
});

/* 리듀서 */
const filteringReducer = handleActions(
    {
        [GET_FILTERING]: (state, {payload}) => {
            return payload;
        },
        [GET_FILTERINGS]: (state, {payload}) => {
            return payload;
        },
        [POST_FILTERING]: (state, {payload}) => {
            return payload;
        },
        [POST_FILTERINGS]: (state, {payload}) => {
            return payload;
        },
        [PUT_FILTERINGS]: (state, {payload}) => {
            return payload;
        },
        [DELETE_FILTERING]: (state, {payload}) => {
            return payload;
        },
        [DELETE_FILTERINGS]: (state, {payload}) => {
            return payload;
        },
        [GET_FILTERINGGROUP]: (state, {payload}) => {
            return payload;
        },
        [POST_FILTERINGGROUP]: (state, {payload}) => {
            return payload;
        },
        [PUT_FILTERINGGROUP]: (state, {payload}) => {
            return payload;
        },
        [DELETE_FILTERINGGROUP]: (state, {payload}) => {
            return payload;
        },
    },
    initialState
);

export default filteringReducer;