import {
    GET_FILTERINGS,
    POST_FILTERINGGROUP
} from '../modules/filtering/FilteringModule.js';

export const callFilteringsAPI = ({groupId}) => {
    const requestURL = `http://localhost:8080/admin/filtering/${groupId}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        console.log('[ReviewAPICalls] callReviewDetailAPI RESULT : ', result);
        if (result.status === 200) {
            console.log('[ReviewAPICalls] callReviewDetailAPI SUCCESS');
            dispatch({ type: GET_FILTERINGS, payload: result });
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

        console.log('[ReviewAPICalls] callReviewDetailAPI RESULT : ', result);
        if (result.status === 200) {
            console.log('[ReviewAPICalls] callReviewDetailAPI SUCCESS');
            dispatch({ type: GET_FILTERINGS, payload: result });
        }
    };
}



// export const callFilteringsCreateAPI = ({ groupId }) => {
//     console.log('[FilteringsAPICalls] callFilteringsCreateAPI Call');
//
//     const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8080/admin/filtering`;
//
//     return async (dispatch, getState) => {
//         const result = await fetch(requestURL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: '*/*',
//                 // Authorization:
//                 //     'Bearer ' + window.localStorage.getItem('accessToken')
//             },
//             body: JSON.stringify([{
//                 filteringId: groupId.filteringId,
//                 groupId: groupId,
//                 videoId: groupId.videoId,
//                 keyword: groupId.keyword,
//                 isActive: groupId.isActive
//             },
//             ])
//         }).then((response) => response.json());
//
//         console.log('[FilteringsAPICalls] callFilteringsCreateAPI RESULT : ', result);
//
//         dispatch({ type: POST_FILTERINGS, payload: result });
//     };
// };

export const callFilteringGroupCreateAPI = ({ form }) => {
    console.log('[FilteringAPICalls] callFilteringGroupCreateAPI Call');

    const requestURL = `http://${import.meta.env.VITE_APP_RESTAPI_IP}:8000/admin/filtering/create`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                // Authorization:
                //     'Bearer ' + window.localStorage.getItem('accessToken')
            },
            body: JSON.stringify({
                // groupId: form.groupId,
                title: form.title,
                content: form.content
            })
        }).then((response) => response.json());

        console.log('[FilteringAPICalls] callFilteringGroupCreateAPI RESULT : ', result);

        dispatch({ type: POST_FILTERINGGROUP, payload: result });
    };
};
