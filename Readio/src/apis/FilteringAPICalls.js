import {
    GET_FILTERINGGROUP,
    GET_FILTERINGGROUPS,
    GET_FILTERINGS,
    POST_FILTERINGGROUP,
    POST_FILTERINGS, PUT_FILTERINGGROUP
} from '../modules/filtering/FilteringModule.js';

export const callFilteringsCreateAPI = ({groupId, filterings}) => {

    const requestURL = `http://localhost:8080/admin/filtering/${groupId}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
            body: JSON.stringify(filterings)
        }).then((response) => response.json());

        console.log('[FilteringAPICalls] callFilteringsAPI RESULT : ', result);
        if (result.status === 200) {
            console.log('[FilteringAPICalls] callFilteringsAPI SUCCESS');
            dispatch({ type: POST_FILTERINGS, payload: result });
        }
    };
}

export const callFilteringGroupCreateAPI = ({ groupForm }) => {
    console.log('[FilteringAPICalls] callFilteringGroupCreateAPI Call');

    const requestURL = `http://localhost:8080/admin/filtering/create`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify({
                title: groupForm.title,
                content: groupForm.content
            })
        }).then((response) => response.json());

        console.log('[FilteringAPICalls] callFilteringGroupCreateAPI RESULT : ', result);

        dispatch({ type: POST_FILTERINGGROUP, payload: result });
        return result;
    };
};

export const callFilteringGroupActiveStateUpdateAPI = ({ groupForm }) => {

    console.log('[FilteringAPICalls] callFilteringGroupActiveStateUpdateAPI Call');

    const requestURL = `http://localhost:8080/admin/filtering`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify(groupForm)
        }).then((response) => response.json());

        console.log('[FilteringAPICalls] callFilteringGroupActiveStateUpdateAPI RESULT : ', result);

        dispatch({ type: PUT_FILTERINGGROUP, payload: result });
    };

}

export const callFilteringGroupsAPI = ({ currentPage }) => {

    let requestURL;

    if (currentPage){
    // if (currentPage !== undefined || currentPage !== null) {
        requestURL = `http://localhost:8080/admin/filtering?offset=${currentPage}`;
    } else {
        requestURL = `http://localhost:8080/admin/filtering`;
    }

    console.log("URL: ", requestURL);
    // const requestURL = `http://localhost:8080/admin/filtering`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        console.log('[FilteringAPICalls] callFilteringGroupsAPI RESULT : ', result);
        if (result.status === 200) {
            console.log('[FilteringAPICalls] callFilteringGroupsAPI SUCCESS');
            dispatch({ type: GET_FILTERINGGROUPS, payload: result.data });
        }
    };
}

export const callFilteringGroupAPI = ({groupId}) => {
    const requestURL = `http://localhost:8080/admin/filtering/${groupId}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        console.log('[FilteringAPICalls] callFilteringGroupAPI RESULT : ', result);
        if (result.status === 200) {
            console.log('[FilteringAPICalls] callFilteringGroupAPI SUCCESS');
            // console.log("result", result);
            dispatch({ type: GET_FILTERINGGROUP, payload: result.data });
        }
    };
}




