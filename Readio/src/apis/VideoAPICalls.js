import { getVideos, postVideo } from "../modules/video/VideoSlice.js";

export const callVideosAPI = ({search}) => {

    const encodedSearch = encodeURIComponent(search);
    let requestURL = `http://localhost:8080/video/${encodedSearch}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        // console.log('[VideoAPICalls] callVideosAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[VideoAPICalls] callVideosAPI SUCCESS');
            dispatch(getVideos(result));
            return result;
        }
    };
}

export const callSearchVideosAPI = ({search}) => {

    const encodedSearch = encodeURIComponent(search);
    let requestURL = `http://localhost:8080/video/query/${encodedSearch}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        // console.log('[VideoAPICalls] callVideosAPI RESULT : ', result);
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
                Accept: '*/*'
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
                Accept: '*/*'
            },
            body: JSON.stringify(form)
        }).then((response) => response.json());

        // console.log('[VideoAPICalls] callVideosAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[VideoAPICalls] callVideosAPI SUCCESS');
            dispatch(postVideo(form));
        }
    };
}
