import { createActions, handleActions } from 'redux-actions';

const initialState = {
    posts: {}
};

const getInitialPostLikeState = () => ({
    isLiked: false,
    likeCount: 0,
    isLoading: false,
    error: null
});

export const GET_POST_LIKE_INFO_REQUEST = 'like/GET_POST_LIKE_INFO_REQUEST';
export const UPDATE_POST_LIKE_STATUS_REQUEST = 'like/UPDATE_POST_LIKE_STATUS_REQUEST';
export const GET_POST_LIKE_INFO_SUCCESS = 'like/GET_POST_LIKE_INFO_SUCCESS';
export const UPDATE_POST_LIKE_STATUS_SUCCESS = 'like/UPDATE_POST_LIKE_STATUS_SUCCESS';
export const POST_LIKE_FAILURE = 'like/POST_LIKE_FAILURE';

const actionCreators = createActions({
    [GET_POST_LIKE_INFO_REQUEST]: (postId) => ({ postId }),
    [UPDATE_POST_LIKE_STATUS_REQUEST]: (postId) => ({ postId }),
    [GET_POST_LIKE_INFO_SUCCESS]: (payload) => payload,
    [UPDATE_POST_LIKE_STATUS_SUCCESS]: (payload) => payload,
    [POST_LIKE_FAILURE]: (payload) => payload,
});

export const {
    getPostLikeInfoRequest,
    updatePostLikeStatusRequest,
    getPostLikeInfoSuccess,
    updatePostLikeStatusSuccess,
    postLikeFailure
} = actionCreators;

const likeReducer = handleActions(
    {
        [GET_POST_LIKE_INFO_REQUEST]: (state, { payload: { postId } }) => ({
            ...state,
            posts: {
                ...state.posts,
                [postId]: {
                    ...(state.posts[postId] || getInitialPostLikeState()),
                    isLoading: true,
                    error: null
                }
            }
        }),
        [UPDATE_POST_LIKE_STATUS_REQUEST]: (state, { payload: { postId } }) => ({
            ...state,
            posts: {
                ...state.posts,
                [postId]: {
                    ...(state.posts[postId] || getInitialPostLikeState()),
                    isLoading: true,
                    error: null
                }
            }
        }),
        [GET_POST_LIKE_INFO_SUCCESS]: (state, { payload }) => {
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [payload.postId]: {
                        isLiked: payload.isLiked,
                        likeCount: payload.likeCount,
                        isLoading: false,
                        error: null
                    }
                }
            };
        },
        [UPDATE_POST_LIKE_STATUS_SUCCESS]: (state, { payload }) => {
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [payload.postId]: {
                        isLiked: payload.isLiked,
                        likeCount: payload.likeCount,
                        isLoading: false,
                        error: null
                    }
                }
            };
        },
        [POST_LIKE_FAILURE]: (state, { payload }) => {
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [payload.postId]: {
                        ...(state.posts[payload.postId] || getInitialPostLikeState()),
                        isLoading: false,
                        error: payload.error
                    }
                }
            };
        },
    },
    initialState
);


export default likeReducer;