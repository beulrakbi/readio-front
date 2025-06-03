import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const POST_POST = 'post/POST_POST';
export const GET_POST = 'post/GET_POST';
export const PUT_POST = 'post/PUT_POST';
export const DELETE_POST = 'post/DELETE_POST';

const actions = createActions({
	[POST_POST]: () => {},
	[GET_POST]: () => {},
	[PUT_POST]: () => {},
	[DELETE_POST]: () => {}
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
		[PUT_POST]: (state, { payload }) => {
			return payload;
		},
		[DELETE_POST]: (state, { payload }) => {
			return payload;
		}
	},
	initialState
);

export default postReducer;
