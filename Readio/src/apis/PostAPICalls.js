import {
	GET_POST,
	POST_POST
} from '../modules/postwriting/PostModule.js';

const getAuthHeader = () => {
	const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
	console.log("PostAPICalls 토큰 :", token)
	return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const callPostCreateAPI = ({ form }) => {
	console.log('[PostAPICalls] callPostAPI Call');

	// 👇 VITE_APP_RESTAPI_IP 값이 제대로 들어오는지 확인!
	console.log('VITE_APP_RESTAPI_IP:', import.meta.env.VITE_APP_RESTAPI_IP);

	const requestURL = `http://localhost:8080/mylibrary/post/writing`;

	// 👇 실제로 만들어진 URL 확인!
	console.log('Request URL:', requestURL);
	console.log("VITE_APP_RESTAPI_IP 환경 변수 값:", import.meta.env.VITE_APP_RESTAPI_IP); // ✨ 환경 변수 값도 확인!

	return async (dispatch, getState) => {
		const result = await fetch(requestURL, {
			method: 'POST',
			headers: {
				Accept: '*/*',
				...getAuthHeader
			},
			body: form
		}).then((response) => response.json());

		console.log('[PostAPICalls] callPostCratetAPI RESULT : ', result);

		dispatch({ type: POST_POST, payload: result });
	};
};

export const callPostDetailAPI = ({ postId }) => {
	const requestURL = `http://localhost:8080/mylibrary/post/${postId}`;

	// 👇 실제로 만들어진 URL 확인!
	console.log('Request URL:', requestURL);
	console.log("VITE_APP_RESTAPI_IP 환경 변수 값:", import.meta.env.VITE_APP_RESTAPI_IP); // ✨ 환경 변수 값도 확인!

	return async (dispatch, getState) => {
		const result = await fetch(requestURL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: '*/*',
				...getAuthHeader()
			}
		}).then((response) => response.json());

		console.log('[PostAPICalls] callPostDetailAPI RESULT : ', result);
		if (result.status === 200) {
			console.log('[PostAPICalls] callPostDetailAPI SUCCESS');
			dispatch({ type: GET_POST, payload: result.data });
		}
	};
};