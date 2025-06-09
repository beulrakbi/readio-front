import {GET_POST, GET_POSTS, POST_POST,} from '../modules/postwriting/PostModule.js'; // PostModule.js 경로 확인

const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    console.log("PostAPICalls 토큰 :", token)
    return token ? {'Authorization': `Bearer ${token}`} : {};
};

export const callPostCreateAPI = ({form}) => {

    const requestURL = `http://localhost:8080/mylibrary/post/writing`;

    console.log('Request URL:', requestURL);

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST', headers: {
                Accept: '*/*', ...getAuthHeader()
            }, body: form
        }).then((response) => response.json());

        console.log('[PostAPICalls] callPostCratetAPI RESULT : ', result);

        dispatch({type: POST_POST, payload: result});
    };
};

export const callPostDetailAPI = ({postId}) => {
    const requestURL = `http://localhost:8080/mylibrary/post/${postId}`;

    console.log('Request URL:', requestURL);

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET', headers: {
                'Content-Type': 'application/json', Accept: '*/*', ...getAuthHeader()
            }
        }).then((response) => response.json());

        console.log('[PostAPICalls] callPostDetailAPI RESULT : ', result);
        if (result.status === 200) {
            console.log('[PostAPICalls] callPostDetailAPI SUCCESS');
            dispatch({type: GET_POST, payload: result.data});
        }
    };
};

export const callPostDeleteAPI = (postId) => {
    const requestURL = `http://localhost:8080/mylibrary/post/delete/${postId}`;
    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: 'DELETE', headers: getAuthHeader()
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

    if (currentPage) {
        requestURL = `http://localhost:8080/mylibrary/post/${userId}/all?offset=${currentPage}`;
    } else {
        requestURL = `http://localhost:8080/mylibrary/post/${userId}/all`;
    }

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET', headers: {
                'Content-Type': 'application/json', Accept: '*/*', ...getAuthHeader()
            }
        }).then((response) => response.json());
        if (result.status === 200) {
            dispatch({type: GET_POSTS, payload: result.data});
        }
    };

}

export const callPostsCountAPI = ({userId}) => {

    const requestURL = `http://localhost:8080/mylibrary/post/${userId}/count`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET', headers: {
                'Content-Type': 'application/json', Accept: '*/*', ...getAuthHeader()
            }
        }).then((response) => response.json());
        if (result.status === 200) {
            dispatch({type: GET_POSTS, payload: result});
        }
    };

}

export const callPostUpdateAPI = ({postId, form}) => {

    const requestURL = `http://localhost:8080/mylibrary/post/modify/${postId}`;

    for (let [key, value] of form.entries()) {
        console.log(key, value instanceof File ? value.name : value);
    }
    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: 'PUT', headers: {
                    Accept: '*/*', ...getAuthHeader()
                }, body: form
            });

            if (!response.ok) {
                let errorData = {message: `게시물 수정 실패 (상태: ${response.status})`};
                try {
                    const resJson = await response.json();
                    if (resJson && resJson.message) errorData.message = resJson.message;
                } catch (e) {
                }
                throw new Error(errorData.message);
            }
            return Promise.resolve({message: "게시물이 성공적으로 수정되었습니다."});
        } catch (error) {
            console.error('[PostAPICalls] callPostUpdateAPI Error:', error);
            throw error;
        }
    };
};

export const apiReportPost = (postId) => {
    const requestURL = `http://localhost:8080/mylibrary/post/report/${postId}`;

    return async (dispatch) => {
        try {
            const response = await fetch(requestURL, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', ...getAuthHeader()
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `게시물 신고 실패 (상태: ${response.status})`);
            }

            const result = await response.json();
            console.log("게시물 신고 성공 (apiReportPost):", result);
            return result.data || result;
        } catch (error) {
            console.error("apiReportPost 에러:", error);
            throw error;
        }
    };
};