import { getReportedReviews } from "../modules/reported/ReportedReviewSlice.js";

export const callReportedReviewAPI = ({ currentPage }) => {


    const getAuthHeader = () => {
        const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
        console.log("신고리뷰 토큰 :", token)
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    let requestURL;

    if (currentPage) {
        requestURL = `http://localhost:8080/admin/reported/reviews?offset=${currentPage}`;
    } else {
        requestURL = `http://localhost:8080/admin/reported/reviews`;
    }

    // const requestURL = `http://localhost:8080/admin/reported/reviews`;
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
            // return result.data;
        }
    };
}
