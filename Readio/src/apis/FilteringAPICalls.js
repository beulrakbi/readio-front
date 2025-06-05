import {
    deleteFilteringGroup,
    getFilteringGroup,
    getFilteringGroups,
    postFilteringGroup,
    postFilterings,
    putFilteringGroup
} from "../modules/filtering/FilteringSlice.js";

// admin 경로에만 헤더 추가
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const callFilteringsCreateAPI = ({groupId, filterings}) => {

    const requestURL = `http://localhost:8080/admin/filtering/${groupId}`;
    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()      // 5.30 토큰 추가
            },
            body: JSON.stringify(filterings)
        }).then((response) => response.json());

        // console.log('[FilteringAPICalls] callFilteringsAPI RESULT : ', result);
        if (result.status === 200) {
            // console.log('[FilteringAPICalls] callFilteringsAPI SUCCESS');
            dispatch(postFilterings(result));
        }
    };
}

export const callFilteringGroupCreateAPI = ({ groupForm }) => {
    // console.log('[FilteringAPICalls] callFilteringGroupCreateAPI Call');

    const requestURL = `http://localhost:8080/admin/filtering/create`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()      // 5.30 토큰 추가
            },
            body: JSON.stringify({
                title: groupForm.title,
                content: groupForm.content,
                typeId: groupForm.typeId
            })
        }).then((response) => response.json());

        dispatch(postFilteringGroup(result));
        return result;
    };
};

export const callFilteringGroupActiveStateUpdateAPI = ({ groupForm }) => {

    const requestURL = `http://localhost:8080/admin/filtering`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()      // 5.30 토큰 추가
            },
            body: JSON.stringify(groupForm)
        }).then((response) => response.json());

        dispatch(putFilteringGroup(result));
    };
}

export const callFilteringGroupUpdateAPI = ({ final }) => {

    const requestURL = `http://localhost:8080/admin/filtering/edit`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()      // 5.30 토큰 추가
            },
            body: JSON.stringify(final)
        }).then((response) => response.json());

        dispatch(putFilteringGroup(result));
    };
}

export const callFilteringGroupDeleteAPI = ({groupId}) => {
    const requestURL = `http://localhost:8080/admin/filtering/${groupId}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()      // 5.30 토큰 추가
            }
        }).then((response) => response.json());

        dispatch(deleteFilteringGroup(result));
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


    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader()      // 5.30 토큰 추가
            }
        }).then((response) => response.json());

        if (result.status === 200) {
            dispatch(getFilteringGroups(result.data));
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
                Accept: '*/*',
                ...getAuthHeader()      // 5.30 토큰 추가
            }
        }).then((response) => response.json());

        if (result.status === 200) {
            dispatch(getFilteringGroup(result));
        }
    };
}




