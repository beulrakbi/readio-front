import { createAsyncThunk } from '@reduxjs/toolkit';

const ALADIN_TTB_KEY = 'ttbnodt121550001'; // 사용자가 제공한 키

export const searchAladinBooks = createAsyncThunk(
    'bookSearch/searchAladin',
    async ({ query, searchType = 'Title', page = 1, loadMore = false }, { rejectWithValue }) => {
        if (!query.trim() && searchType !== 'ItemNewAll') {
            return { items: [], meta: { totalResults: 0, currentPage: 1, isEnd: true }, loadMore: false, query, searchType };
        }

        let apiUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx`;
        const params = new URLSearchParams();
        params.append('ttbkey', ALADIN_TTB_KEY);
        params.append('Query', query);
        params.append('QueryType', searchType);
        params.append('MaxResults', '10');
        params.append('start', page.toString());
        params.append('SearchTarget', 'Book');
        params.append('output', 'js'); // 이 파라미터로 인해 순수 JSON이 올 수도 있고, JSONP일 수도 있음
                                      // 만약 'json'을 지원한다면 'json'으로 변경하는 것이 더 좋음
                                      // 또는 'js'와 함께 'SubOutput=json' 사용 고려
        params.append('Version', '20131101');
        params.append('Cover', 'MidBig');

        const corsProxy = 'https://corsproxy.io/?';
        apiUrl = `${apiUrl}?${params.toString()}`;
        console.log("test", apiUrl);

        try {
            const response = await fetch(corsProxy + encodeURIComponent(apiUrl));
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Aladin API HTTP Error:', response.status, errorText);
                return rejectWithValue({ message: `알라딘 API 오류 (${response.status})`, details: errorText, query, searchType });
            }

            // *** 핵심 수정 부분 시작 ***
            const textData = await response.text(); // 일단 텍스트로 받아서 확인
            console.log("Aladin API Raw Response Text:", textData); // 디버깅용 로그
            let data;

            try {
                // 순수 JSON을 가정하고 바로 파싱 시도
                data = JSON.parse(textData);
            } catch (e) {
                // 만약 여기서 파싱 오류가 계속 난다면, textData 시작/끝에 불필요한 문자(공백, BOM 등)가 있는지,
                // 또는 정말 미세하게 JSON 형식이 깨졌는지 확인해야 합니다.
                // 또는, textData가 여전히 JSONP 콜백으로 감싸져 있는지 다시 확인합니다.
                // 예: textData.trim()을 사용하거나, JSONP 콜백을 더 정확히 제거하는 로직 필요.

                // JSONP 콜백 함수 이름이 있다면 (예: ttbcallback, search 등) 해당 부분 제거
                // 예시: const specificCallback = "ttbcallback"; (실제 콜백명으로 대체)
                // if (textData.startsWith(specificCallback + "(") && textData.endsWith(");")) {
                //    const jsonString = textData.substring(specificCallback.length + 1, textData.length - 2);
                //    try {
                //        data = JSON.parse(jsonString);
                //    } catch (innerError) {
                //        console.error("JSONP 내부 파싱 실패:", jsonString, innerError);
                //        return rejectWithValue({ message: "알라딘 API 응답(JSONP) 처리 실패.", rawResponse: textData, query, searchType });
                //    }
                // } else {
                   console.error("JSON.parse 실패:", textData, e);
                   return rejectWithValue({ message: "알라딘 API 응답을 JSON으로 변환할 수 없습니다.", rawResponse: textData, query, searchType });
                // }
            }
            // *** 핵심 수정 부분 끝 ***


            if (data.errorCode) {
                console.error('Aladin API Business Error:', data.errorCode, data.errorMessage);
                return rejectWithValue({ message: data.errorMessage || `알라딘 API 오류 코드: ${data.errorCode}`, query, searchType });
            }

            const items = (data.item || []).map(item => ({
                isbn: item.isbn13 || item.isbn,
                title: item.title,
                author: item.author,
                publisher: item.publisher,
                coverUrl: item.cover || '기본표지경로.png',
            }));
            

            const totalResults = parseInt(data.totalResults || 0, 10);
            const maxResultsPerPage = 10;

            return { /* ... 이전과 동일 ... */ items, meta: { totalResults, currentPage: page, isEnd: (page * maxResultsPerPage) >= totalResults || items.length === 0 || items.length < maxResultsPerPage }, loadMore, query, searchType };

        } catch (error) {
            console.error("Fetch Aladin books unexpected error:", error);
            return rejectWithValue({ message: error.message || '책 검색 중 알 수 없는 오류가 발생했습니다.', query, searchType });
        }
    }
);