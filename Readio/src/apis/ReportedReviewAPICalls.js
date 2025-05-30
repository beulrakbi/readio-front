import {getReportedReviews} from "../modules/reported/ReportedReviewSlice.js";

export const callReportedReviewAPI = ({currentPage}) => {

    let requestURL;

    if (currentPage){
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
            },
        }).then((response) => response.json());
        console.log("reportedReviews result", result);
        if (result.status === 200) {
            dispatch(getReportedReviews(result.data));
            // return result.data;
        }
    };
}
