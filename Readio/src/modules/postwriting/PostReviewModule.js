import { createActions, handleActions } from 'redux-actions';

const initialState = [];

export const POST_POSTREVIEW = 'postreview/POST_POSTREVIEW';
export const GET_POSTREVIEW = 'postreview/GET_POSTREVIEW';
export const PUT_POSTREVIEW = 'postreview/PUT_POSTREVIEW';

const actions = createActions({
    [POST_POSTREVIEW]: () => {},
    [GET_POSTREVIEW]: () => {},
    [PUT_POSTREVIEW]: () => {}
});

const postReviewReducer = handleActions(
    {
        [POST_POSTREVIEW]: (state, { payload }) => {
            return payload;
        },
        [GET_POSTREVIEW]: (state, { payload }) => {
            return payload;
        },
        [PUT_POSTREVIEW]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default postReviewReducer;