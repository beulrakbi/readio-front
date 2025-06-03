import { createActions, handleActions } from 'redux-actions';

const initialState = {
}; 

/* 액션 타입 */
export const GET_FOLLOW_STATUS = 'follow/GET_FOLLOW_STATUS';
export const UPDATE_FOLLOW_STATUS_SUCCESS = 'follow/UPDATE_FOLLOW_STATUS_SUCCESS';

/* 액션 생성자 */
// const actionCreators = createActions({
//     [GET_FOLLOW_STATUS]: (payload) => payload,
//     [UPDATE_FOLLOW_STATUS_SUCCESS]: (payload) => payload,
// });

// export const { getFollowStatus, updateFollowStatusSuccess } = actionCreators;

export const getFollowStatus = (payload) => ({ type: GET_FOLLOW_STATUS, payload });
export const updateFollowStatusSuccess = (payload) => ({ type: UPDATE_FOLLOW_STATUS_SUCCESS, payload });

/* 리듀서 */
const followReducer = handleActions(
    {
        [GET_FOLLOW_STATUS]: (state, { payload }) => {
            console.log('[followReducer] GET_FOLLOW_STATUS, payload:', payload);
            return payload;
        },
        [UPDATE_FOLLOW_STATUS_SUCCESS]: (state, { payload }) => {
            console.log('[followReducer] UPDATE_FOLLOW_STATUS_SUCCESS, payload:', payload);
            return payload;
        },
    },
    initialState
);

export default followReducer;