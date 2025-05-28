import {
    POST_POSTREVIEW,
    GET_POSTREVIEW,
    DELETE_POSTREVIEW
} from '../modules/postwriting/PostReviewModule.js';

export const callPostReviewAPI = ({ postId, currentPage }) => {
    
    const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/post/${postId}/reviews?offset=${currentPage}`;

    console.log("[API Call] 요청 URL:", requestURL);

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        console.log('[ReviewAPICalls] callPostCratetAPI RESULT : ', result);

        if (result.status === 200) {
            dispatch({ type: GET_POSTREVIEW, payload: result});
        }
    };
};

export const callPostReviewWritingAPI = ({ postId, form }) => {
    
    const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/post/${postId}/reviews`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                Authorization:
					'Bearer ' + window.localStorage.getItem('accessToken')
			},
            body: JSON.stringify({
                postReviewContent: form.postReviewContent
            })
        }).then((response) => response.json());

        dispatch({ type: POST_POSTREVIEW, payload: result});
    };
};

export const callPostReviewDeleteAPI = ({ reviewId }) => {
    
    const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/post/reviews/${reviewId}`;

    console.log("[API Call] DELETE 요청 URL:", requestURL);

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('accessToken')
            }
        }).then(response => {
            if (response.status === 204) { 
                return { 
                    status: 204, 
                    message: "리뷰가 성공적으로 삭제되었습니다.", 
                    data: { deletedReviewId: reviewId }
                };
            }
            return response.json();
        });

        console.log('[ReviewAPICalls] callPostReviewDeleteAPI RESULT : ', result);
        dispatch({ type: DELETE_POSTREVIEW, payload: { result, reviewId } });
    };
};