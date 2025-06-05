import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = {
    postDetail: null, // 단일 게시물 상세 정보
    pageInfo: {      // 페이지 정보 객체 (총 게시물 수 포함)
        total: 0,
        currentPage: 1,
    },
    posts: [],       // 게시물 목록 (예: callAllPosts 용)
};

/* 액션 타입 상수 정의 */
// 상수를 먼저 정의합니다.
const POST_POST_ACTION = 'post/POST_POST';
const GET_POST_ACTION = 'post/GET_POST';
const PUT_POST_ACTION = 'post/PUT_POST';
const DELETE_POST_ACTION = 'post/DELETE_POST';
const SET_POSTS_COUNT_ACTION = 'post/SET_POSTS_COUNT'; // 새로 추가된 액션 타입 상수

// 이 상수들을 외부에서 import하여 사용할 수 있도록 export 합니다.
export const POST_POST = POST_POST_ACTION;
export const GET_POST = GET_POST_ACTION;
export const PUT_POST = PUT_POST_ACTION;
export const DELETE_POST = DELETE_POST_ACTION;
export const SET_POSTS_COUNT = SET_POSTS_COUNT_ACTION;


/* 액션 생성자 함수 생성 */
// 정의된 상수들을 사용하여 createActions를 호출합니다.
const actions = createActions({
    [GET_POST_ACTION]: (result) => result,
    [POST_POST_ACTION]: (result) => result,
    [PUT_POST_ACTION]: (result) => result,
    [DELETE_POST_ACTION]: (result) => result,
    [SET_POSTS_COUNT_ACTION]: (totalCount) => ({ total: totalCount }),
});

/* 리듀서 */
const postReducer = handleActions(
    {
        [POST_POST_ACTION]: (state, { payload }) => {
            return {
                ...state,
                // 예: postCreationResult: payload
            };
        },
        [GET_POST_ACTION]: (state, { payload }) => {
            if (payload && payload.data) {
                return {
                    ...state,
                    postDetail: payload.data,
                };
            }
            if (payload && Array.isArray(payload)) {
                return {
                    ...state,
                    posts: payload,
                };
            }
            return {
                ...state,
                postDetail: payload,
            };
        },
        [PUT_POST_ACTION]: (state, { payload }) => {
            return {
                ...state,
                // 예: postUpdateResult: payload
            };
        },
        [DELETE_POST_ACTION]: (state, { payload }) => {
            return {
                ...state,
                // 예: postDeleteResult: payload
            };
        },
        [SET_POSTS_COUNT_ACTION]: (state, { payload }) => ({
            ...state,
            pageInfo: {
                ...state.pageInfo,
                total: payload.total,
            },
        }),
    },
    initialState
);

export default postReducer;