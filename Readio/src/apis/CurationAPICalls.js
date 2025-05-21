import {getCurationKeywords} from "../modules/video/CurationSlice.js";


export const callCurationsAPI = ({type}) => {
    const requestURL = `http://localhost:8080/curation/${type}`;
    // console.log("type이 뭔지", type);
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
        }).then((response) => response.json());

        console.log('[CurationAPICalls] callCurationsAPI RESULT : ', result);
        if (result.status === 200) {
            console.log('[CurationAPICalls] callCurationsAPI SUCCESS');
            dispatch({ type: getCurationKeywords, payload: result });
        }
    };
}