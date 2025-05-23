import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const POST_POST = 'post/POST_POST';
export const GET_POST = 'post/GET_POST';

const actions = createActions({
	[POST_POST]: () => {},
	[GET_POST]: () => {}
});

/* 리듀서 */
const postReducer = handleActions(
	{
		[POST_POST]: (state, { payload }) => {
			return payload;
		},
		[GET_POST]: (state, { payload }) => {
			return payload;
		},
	},
	initialState
);

export default postReducer;
