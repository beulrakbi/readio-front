import {createAction, handleActions} from 'redux-actions';

const initialState = {
    data: []
};

export const GET_CURATIONKEYWORD = 'curationKeywords/GET_CURATIONKEYWORD';
export const GET_CURATIONKEYWORDS = 'curationKeywords/GET_CURATIONKEYWORDS';

const action = createAction({
    [GET_CURATIONKEYWORD]: () => {},
    [GET_CURATIONKEYWORDS]: () => {},
});

const curationReducer = handleActions(
    {
        [GET_CURATIONKEYWORD]: (state, {payload}) => {
            return payload;
        },
        [GET_CURATIONKEYWORDS]: (state, { payload }) => {
            return {
                ...state,
                keywords: payload.data,
                status: payload.status,
                message: payload.message
            };
        }
    },
    initialState
);

export default curationReducer;