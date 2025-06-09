import { getVideos, postVideo } from "../modules/video/VideoSlice.js";

const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
    // console.log("큐레이션 토큰 :",  token);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};



export const callVideosAPI = ({type, search}) => {

    type = parseInt(type);
    if (type === 1) {
        const keywordArray = search.split(" ");
        search = keywordArray[0];
    }
    else if (type === 4)
    {
        const keywordsArray = search.split(" ");
        search = keywordsArray[0] + " ";
        for (let i = 1; i < keywordsArray.length - 1; i++)
        {
            search += keywordsArray[i];
            if (i < keywordsArray.length - 2)
                search += " ";
        }
    }

    let requestURL = `http://localhost:8080/video/${search}/${type}`;

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
            dispatch(getVideos(result.data));
            return result.data;
        }
    };
}

export const callSearchVideosAPI = ({search}) => {

    const keywordArray = search.split(" : ");
    const keywordArray2 = search.split(" - ");
    if (keywordArray[0].length > keywordArray2[0].length)
        search = keywordArray2[0];
    else
        search = keywordArray[0];

    let requestURL = `http://localhost:8080/video/query/${search}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()
            }
        }).then((response) => response.json());

        console.log('[VideoAPICalls] callVideosAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[VideoAPICalls] callVideosAPI SUCCESS');
            dispatch(getVideos(result));
            return result;
        }
    };
}


export const callTopVideosAPI = () => {
    let requestURL = `http://localhost:8080/video/getTopVideos`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()
            }
        }).then((response) => response.json());

        // console.log('[VideoAPICalls] callTopVideosAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[VideoAPICalls] callTopVideosAPI SUCCESS');
            dispatch(getVideos(result));
            return result;
        }
    };
}


export const callVideoInsertAPI = ({form}) => {

    let requestURL = `http://localhost:8080/video/insert`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify(form)
        }).then((response) => response.json());

        // console.log('[VideoAPICalls] callVideosAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[VideoAPICalls] callVideosAPI SUCCESS');
            dispatch(postVideo(form.data));
        }
    };
}
