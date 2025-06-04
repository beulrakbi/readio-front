import {
    GET_POST,
    POST_POST,
    PUT_POST,
    DELETE_POST,
    SET_POSTS_COUNT // 새로 추가된 액션 임포트
} from '../modules/postwriting/PostModule.js'; // PostModule.js 경로 확인

const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    console.log("PostAPICalls 토큰 :", token)
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const callPostCreateAPI = ({ form }) => {

    const requestURL = `http://localhost:8080/mylibrary/post/writing`;

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
        try {
            const response = await fetch(requestURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    ...getAuthHeader()
                }
            });
            
            if (!response.ok) {
                throw new Error(`게시물 개수 조회 실패 (상태: ${response.status})`);
            }

            const result = await response.json();

            // --- 서버 응답 'result'의 실제 구조를 확인하는 로그 ---
            console.log('[PostAPICalls] callPostsCountAPI 서버 응답 RESULT : ', result);
            // --------------------------------------------------------

            let totalCount = 0; 

            // 서버 응답 형태에 따라 totalCount를 추출
            // 1. 응답 객체에 직접 total 속성이 있는 경우 (예: { total: 10 })
            if (typeof result.total === 'number') {
                totalCount = result.total;
            } 
            // 2. 응답 객체의 data 속성 안에 total 속성이 있는 경우 (예: { data: { total: 10 } })
            else if (result.data && typeof result.data.total === 'number') {
                totalCount = result.data.total;
            } 
            // 3. 응답 객체에 직접 count 속성이 있는 경우 (예: { count: 10 })
            else if (typeof result.count === 'number') {
                totalCount = result.count;
            }
            // 4. 응답 객체의 data 속성 안에 count 속성이 있는 경우 (예: { data: { count: 10 } })
            else if (result.data && typeof result.data.count === 'number') {
                totalCount = result.data.count;
            }
            // 그 외의 경우 (총 개수가 바로 숫자 값으로 반환되는 경우)
            // else if (typeof result === 'number') {
            //     totalCount = result;
            // }

            console.log(`[PostAPICalls] 추출된 totalCount: ${totalCount}`);
            
            // PostModule.js의 SET_POSTS_COUNT 액션 생성자는 (totalCount) => ({ total: totalCount }) 형태이므로,
            // 여기에 순수 숫자 `totalCount`를 `payload`로 전달하면 됩니다.
            dispatch({ type: SET_POSTS_COUNT, payload: totalCount });

            // API 호출 자체의 성공 여부를 Promise.resolve로 반환 (선택 사항)
            return Promise.resolve(result.data || result);

        } catch (error) {
            console.error('[PostAPICalls] callPostsCountAPI 오류 발생:', error);
            // 오류 발생 시에도 Redux 상태를 업데이트하여 0으로 설정하거나 오류 상태를 반영할 수 있습니다.
            dispatch({ type: SET_POSTS_COUNT, payload: 0 }); 
            return Promise.reject(error);
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
                throw new Error(errorData.message);
            }
            return Promise.resolve({ message: "게시물이 성공적으로 수정되었습니다." });
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
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