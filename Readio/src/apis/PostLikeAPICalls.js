import {
    getPostLikeInfoRequest,      // 추가
    updatePostLikeStatusRequest, // 추가
    getPostLikeInfoSuccess,
    updatePostLikeStatusSuccess,
    postLikeFailure
} from '../modules/postlike/postLikeModule';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const BASE_URL = 'http://localhost:8080';

/**
 * 특정 게시물의 초기 좋아요 상태 및 개수 조회 (Thunk)
 */
export const apiGetPostLikeInfo = (postId) => {
    const likeStatusURL = `${BASE_URL}/post/${postId}/like-status`;
    const likeCountURL = `${BASE_URL}/post/${postId}/likes/count`;

    return async (dispatch) => {
        console.log(`[LikeAPICalls] apiGetPostLikeInfo THUNK for postId: ${postId}`);
        dispatch(getPostLikeInfoRequest(postId)); // API 호출 시작 알림

        try {
            const [statusResponse, countResponse] = await Promise.all([
                fetch(likeStatusURL, {
                    method: 'GET',
                    headers: { ...getAuthHeader(), 'Content-Type': 'application/json', Accept: '*/*' }
                }),
                fetch(likeCountURL, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', Accept: '*/*' }
                })
            ]);

            // isLiked와 likeCount를 개별적으로 처리하여 하나가 실패해도 다른 하나는 반영될 수 있도록 고려
            // 또는 둘 다 성공해야만 상태를 업데이트하도록 할 수도 있습니다. 여기서는 각각 처리 시도.

            let isLiked = false; // 기본값
            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                isLiked = statusData.isLiked;
            } else {
                // 401, 403 등의 경우 isLiked는 false로 유지, 404는 post가 없다는 의미일 수 있음
                console.warn(`[LikeAPICalls] Failed to fetch like status for post ${postId}, Status: ${statusResponse.status}`);
                // 심각한 오류가 아니라면 (예: 비로그인 시 상태 조회) 여기서 에러를 던지지 않을 수도 있음
                // 로그인 안 한 사용자는 isLiked: false로 응답이 올 수도 있습니다. (컨트롤러 로직 확인 필요)
                if (statusResponse.status === 404) throw new Error(`Post ${postId} not found for like status.`);
            }
            
            let likeCount = 0; // 기본값
            if (countResponse.ok) {
                const countData = await countResponse.json();
                likeCount = countData.likeCount;
            } else {
                console.warn(`[LikeAPICalls] Failed to fetch like count for post ${postId}, Status: ${countResponse.status}`);
                if (countResponse.status === 404) throw new Error(`Post ${postId} not found for like count.`);
                 // 심각한 오류가 아니라면 여기서 에러를 던지지 않을 수도 있음
            }


            const payload = {
                postId: postId, // payload에 postId 추가
                isLiked: isLiked,
                likeCount: likeCount
            };
            console.log('[LikeAPICalls] apiGetPostLikeInfo: Dispatching getPostLikeInfoSuccess with payload:', payload);
            dispatch(getPostLikeInfoSuccess(payload));

        } catch (error) {
            console.error('[LikeAPICalls] apiGetPostLikeInfo CATCH Exception:', error);
            dispatch(postLikeFailure({ postId: postId, error: error.message })); // payload에 postId 추가
        }
    };
};

/**
 * 게시물 좋아요 요청 (Thunk)
 */
export const apiLikePost = (postId) => {
    const requestURL = `${BASE_URL}/post/${postId}/likes`;

    return async (dispatch) => {
        console.log(`[LikeAPICalls] apiLikePost THUNK for postId: ${postId}`);
        dispatch(updatePostLikeStatusRequest(postId)); // API 호출 시작 알림

        try {
            const response = await fetch(requestURL, {
                method: 'POST',
                headers: { ...getAuthHeader(), 'Content-Type': 'application/json', Accept: '*/*' }
            });

            const responseData = await response.json();
            console.log('[LikeAPICalls] apiLikePost API RESPONSE:', responseData, 'Status:', response.status);

            if (!response.ok) {
                throw new Error(responseData.message || `좋아요 요청 실패 (상태: ${response.status})`);
            }

            const payload = {
                postId: postId, // payload에 postId 추가
                isLiked: responseData.isLiked,
                likeCount: responseData.likeCount
            };
            console.log('[LikeAPICalls] apiLikePost: Dispatching updatePostLikeStatusSuccess with payload:', payload);
            dispatch(updatePostLikeStatusSuccess(payload));

        } catch (error) {
            console.error('[LikeAPICalls] apiLikePost CATCH Exception:', error);
            dispatch(postLikeFailure({ postId: postId, error: error.message })); // payload에 postId 추가
        }
    };
};

/**
 * 게시물 좋아요 취소 요청 (Thunk)
 */
export const apiUnlikePost = (postId) => {
    const requestURL = `${BASE_URL}/post/${postId}/likes`;

    return async (dispatch) => {
        console.log(`[LikeAPICalls] apiUnlikePost THUNK for postId: ${postId}`);
        dispatch(updatePostLikeStatusRequest(postId)); // API 호출 시작 알림

        try {
            const response = await fetch(requestURL, {
                method: 'DELETE',
                headers: { ...getAuthHeader(), 'Content-Type': 'application/json', Accept: '*/*' }
            });

            const responseData = await response.json();
            console.log('[LikeAPICalls] apiUnlikePost API RESPONSE:', responseData, 'Status:', response.status);

            if (!response.ok) {
                throw new Error(responseData.message || `좋아요 취소 요청 실패 (상태: ${response.status})`);
            }

            const payload = {
                postId: postId, // payload에 postId 추가
                isLiked: responseData.isLiked,
                likeCount: responseData.likeCount
            };
            console.log('[LikeAPICalls] apiUnlikePost: Dispatching updatePostLikeStatusSuccess with payload:', payload);
            dispatch(updatePostLikeStatusSuccess(payload));

        } catch (error) {
            console.error('[LikeAPICalls] apiUnlikePost CATCH Exception:', error);
            dispatch(postLikeFailure({ postId: postId, error: error.message })); // payload에 postId 추가
        }
    };
};