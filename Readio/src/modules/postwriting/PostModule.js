import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const POST_PRODUCT = 'post/POST_PRODUCT';

const actions = createActions({
	[POST_PRODUCT]: () => {}
});

/* 리듀서 */
const postReducer = handleActions(
	{
		[POST_PRODUCT]: (state, { payload }) => {
			return payload;
		}
	},
	initialState
);

export default postReducer;
