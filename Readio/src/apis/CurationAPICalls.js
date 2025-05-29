import {getAllCuration, getCurationKeywords, getCurationTypes, putAllCuration} from "../modules/video/CurationSlice.js";


export const callCurationTypesAPI = () => {
    const requestURL = `http://localhost:8080/curation`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
        }).then((response) => response.json());
        console.log("result", result);
        if (result.status === 200) {
            dispatch(getCurationTypes(result));
            return result;
        }
    };
}

export const callAllCurationTypesAndKeywordsAPI = () => {
    const requestURL = `http://localhost:8080/admin/curation/all`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
        }).then((response) => response.json());

        console.log('[CurationAPICalls] callCurationTypesAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[CurationAPICalls] callCurationTypesAPI SUCCESS');
            dispatch(getAllCuration(result));
            return result;
        }
    };
}

export const callUpdateAllAPI = (curationDTO) => {
    const requestURL = `http://localhost:8080/admin/curation/save`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
            body: JSON.stringify(curationDTO)
        }).then((response) => response.json());

        console.log('[CurationAPICalls] callCurationTypesAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[CurationAPICalls] callCurationTypesAPI SUCCESS');
            dispatch(putAllCuration(result));
            return result;
        }
    };

}

export const callCurationKeywordsAPI = ({typeId}) => {
    const requestURL = `http://localhost:8080/curation/${typeId}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
        }).then((response) => response.json());

        // console.log('[CurationAPICalls] callCurationsAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[CurationAPICalls] callCurationsAPI SUCCESS');
            dispatch(getCurationKeywords(result));
        }
    };
}