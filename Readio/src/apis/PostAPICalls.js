import {
	GET_POST,
	POST_POST,
	PUT_POST,
    DELETE_POST
} from '../modules/postwriting/PostModule.js';

const getAuthHeader = () => {
	const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
	console.log("PostAPICalls 토큰 :", token)
	return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const callPostCreateAPI = ({ form }) => {

	const requestURL = `http://localhost:8080/mylibrary/post/writing`;

	// 👇 실제로 만들어진 URL 확인!
	console.log('Request URL:', requestURL);

	return async (dispatch, getState) => {
		const result = await fetch(requestURL, {
			method: 'POST',
			headers: {
				Accept: '*/*',
				...getAuthHeader()
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

export const callPostDeleteAPI = (postId) => {
    const requestURL = `http://localhost:8080/mylibrary/post/delete/${postId}`;
    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            if (!response.ok) {
                throw new Error(`게시물 삭제 실패 (상태: ${response.status})`);
            }
            return Promise.resolve();
        } catch (error) {
            console.error("apiDeletePost 에러:", error);
            return Promise.reject(error);
        }
    };
};

export const callAllPosts = ({userId, currentPage}) => {
    let requestURL;

    if (currentPage){
        requestURL = `http://localhost:8080/mylibrary/post/${userId}/all?offset=${currentPage}`;
    } else {
        requestURL = `http://localhost:8080/mylibrary/post/${userId}/all`;
    }

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()
            }
        }).then((response) => response.json());
        if (result.status === 200) {
            dispatch({ type: GET_POST, payload: result.data });
        }
    };

}

export const callPostsCountAPI = ({userId}) => {

    const requestURL = `http://localhost:8080/mylibrary/post/${userId}/count`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()
            }
        }).then((response) => response.json());
        if (result.status === 200) {
            dispatch({ type: GET_POST, payload: result.data });
            return result.data;
        }
    };

}

export const callPostUpdateAPI = ({ postId, form }) => {

    const requestURL = `http://localhost:8080/mylibrary/post/modify/${postId}`;

    for (let [key, value] of form.entries()) {
        console.log(key, value instanceof File ? value.name : value);
    }
    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: 'PUT',
                headers: {
                    Accept: '*/*',
                    ...getAuthHeader()
                },
                body: form
            });

            if (!response.ok) {
                let errorData = { message: `게시물 수정 실패 (상태: ${response.status})` };
                try {
                    const resJson = await response.json();
                    if (resJson && resJson.message) errorData.message = resJson.message;
                } catch (e) {}
				dispatch({ type: PUT_POST, payload: result.data || result });
                throw new Error(errorData.message);
            }
            return Promise.resolve({ message: "게시물이 성공적으로 수정되었습니다." });
        } catch (error) {
            console.error('[PostAPICalls] callPostUpdateAPI Error:', error);
            throw error;
        }
    };
};

export const apiReportPost = (postId) => { // 신고 사유(reason)는 현재 단순 증가이므로 필요 없을 수 있음
    const requestURL = `http://localhost:8080/mylibrary/post/report/${postId}`; // 백엔드 엔드포인트와 일치

    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: 'POST', // POST 요청
                headers: {
                    'Content-Type': 'application/json', // JSON 바디를 보내지 않아도 이 헤더는 유지해도 됩니다.
                    ...getAuthHeader()
                }
                // body는 현재 필요 없습니다 (간단히 postId만으로 처리하므로)
            });

            if (!response.ok) {
                const errorData = await response.json(); // 백엔드 응답이 JSON이라고 가정
                throw new Error(errorData.message || `게시물 신고 실패 (상태: ${response.status})`);
            }

            const result = await response.json();
            console.log("게시물 신고 성공 (apiReportPost):", result);
            // 필요하다면 리듀서 액션을 dispatch하여 프론트엔드 상태를 업데이트할 수 있습니다.
            // 예를 들어, 신고수 증가 액션 (PostModule에 정의 필요)
            // dispatch({ type: INCREMENT_REPORT_COUNT, payload: { postId: postId, newReportCount: result.data } });
            return result.data || result; // 백엔드에서 반환하는 결과 (예: 증가된 신고수)
        } catch (error) {
            console.error("apiReportPost 에러:", error);
            throw error; // 에러를 다시 던져 PostDetail.jsx에서 catch 할 수 있게 함
        }
    };
};