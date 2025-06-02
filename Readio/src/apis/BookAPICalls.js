// src/apis/BookAPICalls.js

import { getBooks, postBook } from "../components/book/BookSlice";
import {getBook} from "../modules/Book/BookPageSlice.js";
import {getBookReviews, putReportingReview} from "../modules/Book/BookReviewSlice.js";

const BASE_URL = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx";
const TTB_KEY  = "ttbehfvls09271435001"; 

export const callBooksAPI = ({ search, page = 1, size = 10 }) => {
    const start = (page - 1) * size + 1;
    const corsProxy = 'https://corsproxy.io/?';

    const targetUrl = `${BASE_URL}` +
        `?ttbkey=${TTB_KEY}` +
        `&Query=${encodeURIComponent(search)}` +
        `&QueryType=Title` +
        `&MaxResults=${size}` +
        `&start=${start}` +
        `&SearchTarget=Book` +
        `&output=js` +
        `&Version=20131101`;    //  API 버전 파라미터 추가

    // const requestURL = corsProxy + targetUrl; //  프록시 적용
    const requestURL = corsProxy + targetUrl;

    console.log("[BookAPICalls] 요청 URL:", requestURL); //  디버그용

    return async (dispatch, getState) => {
        let responseText = '';
        try {
            const response = await fetch(requestURL);
            responseText = await response.text(); // 먼저 텍스트로 읽기

            // HTTP 에러 처리
            if (!response.ok) {
                console.error(`[BookAPICalls] HTTP 오류 ${response.status}`, responseText.substring(0,200));
                if (responseText.trim().toLowerCase().startsWith('<?xml')) {
                    // XML 에러 메시지 추출
                    const m = responseText.match(/<errorstring>(.*?)<\/errorstring>/i);
                    const detail = m?.[1] || "XML 에러 응답";
                    return { item: [], totalResults: 0, error: `XML 오류: ${detail}` };
                }
                return { item: [], totalResults: 0, error: `HTTP 오류 ${response.status}` };
            }

            // XML 응답인 경우
            // if (responseText.trim().toLowerCase().startsWith('<?xml')) {
            //     console.error(`[BookAPICalls] JSON 예상했으나 XML 수신`, responseText.substring(0,200));
            //     const m = responseText.match(/<errorstring>(.*?)<\/errorstring>/i);
            //     const detail = m?.[1] || "알 수 없는 XML 오류";
            //     return { item: [], totalResults: 0, error: `서버 XML 응답: ${detail}` };
            // }

            // JSON 파싱
            let result = JSON.parse(responseText); //  JSON.parse 사용

             if (typeof result === 'string') {
                console.log("[BookAPICalls] 첫 번째 파싱 결과가 문자열이므로, 두 번째 파싱을 시도합니다. 문자열 앞부분:", result.substring(0, 200));
                result = JSON.parse(result); // 두 번째 파싱
            }
            // const result = responseText.trim();
            console.log("[BookAPICalls] 파싱 결과:", result);

            if (result.item) {
                dispatch(getBooks(result)); // redux 상태에 저장
                return result;
            } else if (result.errorCode) {
                console.error(`[BookAPICalls] 알라딘 API 오류`, result.errorMessage);
                return { item: [], totalResults: 0, error: `API 오류: ${result.errorMessage}` };
            } else if ('totalResults' in result && 'item' in result) {
                dispatch(getBooks(result)); // 빈 결과라도 구조가 맞으면
                return result;
            } else {
                console.warn("[BookAPICalls] 예상치 못한 응답 형식", result);
                return { item: [], totalResults: 0, error: "알 수 없는 응답 형식" };
            }

        } catch (error) {
            console.error(`[BookAPICalls] 처리 중 예외:`, error, responseText.substring(0,200));
            return { item: [], totalResults: 0, error: `처리 예외: ${error.message}` };
        }
    };
};

// callBookInsertAPI 는 생략합니다 (기존 동일)
export const callBookInsertAPI = ({ form }) => {
    // const INSERT_URL = "http://localhost:8080/api/book/insert"; //  백엔드 엔드포인트
    // const INSERT_URL = "http://localhost:8080/search/book"; //  백엔드 엔드포인트
    const INSERT_URL = "http://localhost:8080/api/search/book"; //  백엔드 엔드포인트
    return async dispatch => {
        try {
            const res = await fetch(INSERT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error(`저장 실패 ${res.status}`);
            const json = await res.json();
            dispatch(postBook(form));
            return { success: true, data: json };
        } catch (e) {
            console.error("[BookAPICalls] 저장 예외", e);
            return { success: false, error: e.message };
        }
    };
};

export const callBookAPI = ({bookIsbn}) => {
    const requestURL = `http://localhost:8080/bookPage/${bookIsbn}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        }).then((response) => response.json());

        // console.log("result", result);
        if (result.status === 200) {
            dispatch(getBook(result.data));
            return result.data;
        }
    };
}

export const callBookReviewsAPI = ({bookIsbn}) => {
    const requestURL = `http://localhost:8080/bookReview/${bookIsbn}`;

    return async (dispatch, getState) => {
        const result = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
        }).then((response) => response.json());

        console.log("bookreviews", result);
        if (result.status === 200) {
            dispatch(getBookReviews(result));
        }
    };
}

export const callBookReviewReportAPI = ({ reviewId }) => {
    const requestURL = `http://localhost:8080/bookReview/${reviewId}/report`;

    return async () => {
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            }
        });
        console.log("resulttttt", result);
        if (!result.ok) {
            throw new Error("리뷰 신고 실패");
        }
    };
};

