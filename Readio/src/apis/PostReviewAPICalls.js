import {
    POST_POSTREVIEW,
    GET_POSTREVIEW,
    PUT_POSTREVIEW
} from '../modules/postwriting/PostReviewModule.js';

export const callPostReviewAPI = ({ postId, currentPage }) => {
    
    const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/post/${postId}/reviews?offset=${currentPage}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        if (result.status === 200) {
            dispatch({ type: GET_POSTREVIEW, payload: result});
        }
    };
};

export const callPostReviewWritingAPI = ({ form }) => {
    
    const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/${postId}/reviews`;

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
                postId: form,postId,
                postReviewContent: form,postReviewContent
            })
        }).then((response) => response.json());

        dispatch({ type: POST_POSTREVIEW, payload: result});
    };
};

export const callPostReviewUpdateAPI = ({ form }) => {

	const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/post/reviews/{reviewId}`;

	return async (dispatch, getState) => {
		const result = await fetch(requestURL, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: '*/*',
				Authorization:
					'Bearer ' + window.localStorage.getItem('accessToken')
			},
			body: JSON.stringify({
				postReviewId: form.postReviewId,
				postReviewContent: form,postReviewContent
			})
		}).then((response) => response.json());

		dispatch({ type: PUT_POSTREVIEW, payload: result });
	};
};