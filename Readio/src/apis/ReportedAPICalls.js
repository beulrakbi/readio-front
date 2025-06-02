import {
    getReportedPost, getReportedPosts,
    getReportedReview,
    getReportedReviews,
    putReportedPost,
    putReportedReview
} from "../modules/reported/ReportedSlice.js";

const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
    console.log("신고리뷰 토큰 :", token)
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const callReportedReviewsAPI = ({ currentPage }) => {
    let requestURL;

    if (currentPage) {
        requestURL = `http://localhost:8080/admin/reported/review?offset=${currentPage}`;
    } else {
        requestURL = `http://localhost:8080/admin/reported/review`;
    }

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader
            },
        }).then((response) => response.json());
        console.log("reportedReviews result", result);
        if (result.status === 200) {
            dispatch(getReportedReviews(result.data));
        }
    };
}

export const callReportedReviewAPI = ({reportId}) => {
    const requestURL = `http://localhost:8080/admin/reported/review/${reportId}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader
            },
        }).then((response) => response.json());
        console.log("reportedReview result", result);
        if (result.status === 200) {
            dispatch(getReportedReview(result));
            // return result.data;
        }
    };

}


export const callReportedReviewUpdateAPI = ({reportId}) => {
    const requestURL = `http://localhost:8080/admin/reported/review/${reportId}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader
            },
        }).then((response) => response.json());
        console.log("reportedReview Update result", result);
        if (result.status === 200) {
            dispatch(putReportedReview(result.data));
        }
    };
}

export const callReportedPostsAPI = ({ currentPage }) => {
    let requestURL;

    if (currentPage) {
        requestURL = `http://localhost:8080/admin/reported/post?offset=${currentPage}`;
    } else {
        requestURL = `http://localhost:8080/admin/reported/post`;
    }

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                // ...getAuthHeader
            },
        }).then((response) => response.json());
        console.log("reportedPosts result", result);
        if (result.status === 200) {
            dispatch(getReportedPosts(result.data));
        }
    };
}

export const callReportedPostAPI = ({reportId}) => {
    const requestURL = `http://localhost:8080/admin/reported/post/${reportId}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader
            },
        }).then((response) => response.json());
        console.log("reportedPost result", result);
        if (result.status === 200) {
            dispatch(getReportedPost(result));
            // return result.data;
        }
    };

}


export const callReportedPostUpdateAPI = ({reportId}) => {
    const requestURL = `http://localhost:8080/admin/reported/post/${reportId}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                ...getAuthHeader
            },
        }).then((response) => response.json());
        console.log("reportedPost Update result", result);
        if (result.status === 200) {
            dispatch(putReportedPost(result.data));
        }
    };
}


