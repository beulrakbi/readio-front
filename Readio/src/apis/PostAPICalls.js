import {
    POST_PRODUCT
} from '../modules/postwriting/PostModule.js';

export const callPostCreateAPI = ({ form }) => {
	console.log('[PostAPICalls] callPostAPI Call');

     // 👇 VITE_APP_RESTAPI_IP 값이 제대로 들어오는지 확인!
    console.log('VITE_APP_RESTAPI_IP:', import.meta.env.VITE_APP_RESTAPI_IP); 

	const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/post/writing`;

        // 👇 실제로 만들어진 URL 확인!
    console.log('Request URL:', requestURL); 

	return async (dispatch, getState) => {
		const result = await fetch(requestURL, {
			method: 'POST',
			headers: {
				Accept: '*/*',
				Authorization:
					'Bearer ' + window.localStorage.getItem('accessToken')
			},
			body: form
		}).then((response) => response.json());

		console.log('[PostAPICalls] callPostCratetAPI RESULT : ', result);

		dispatch({ type: POST_PRODUCT, payload: result });
	};
};