import sample from "./test.json";
import { callSearchVideosAPI, callTopVideosAPI, callVideoInsertAPI, callVideosAPI } from "./VideoAPICalls.js";


export async function getVideosByKeyword(type, keyword, dispatch) {
    let result = await dispatch(callVideosAPI({type:type, search: keyword}));

    if (result) {
        return result;
    }
}

export async function searchVideosByKeyword(keyword, dispatch) {
    let result = await dispatch(callSearchVideosAPI({search: keyword}));
    if (result) {
        return result;
    }
}


export async function getTopVideos(dispatch) {
    return await dispatch(callTopVideosAPI());
}


export async function getNewVideos(type, keyword, dispatch, num, foundVideos, filtering) {

    // AIzaSyBmgnlyqWd6hYWztLA-_gM4TgIEx2XGd6s (수민)
    // AIzaSyDhnTEJd1zHHo-o98rsn51pHTYX8mbPI4I (성경님)

    // 추가 API 
    // AIzaSyA2Cyb_5A9hMOylg1aAqCBSbsaUfYnHMEA (성경님)
    // AIzaSyBgFSJpcl_vuWe0oHdP-S59-E_zWIbouto (수민)

    let maxResult = 5;

    if (maxResult <= num) {

        // return null; 
        // console.log("이미 충분한 영상이 있거나 요청할 영상 개수가 0 이하입니다.");
        return []; // 빈 배열 반환하여 후속 에러 방지
    }
    else {

        if (type === "1") {
            keyword = keyword + '|낭독|리뷰'
        }

        for (let i = 0; i < foundVideos.length; i++)
        {
            keyword += "- " + foundVideos[i].videoId;
        }

        if (Array.isArray(filtering))
        {
            for (let i = 0; i < filtering.length; i++)
            {
                if (filtering[i].keyword != null)
                    keyword += "- " + filtering[i].keyword;
                else
                    keyword += "- " + filtering[i].videoId;
            }
        }
        console.log("Filter", filtering);
        console.log("최종 쿼리", keyword);
        maxResult = maxResult - num;

        try {
            const encodedKeyword = encodeURIComponent(keyword);
            const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodedKeyword + '&type=video&maxResults=' + maxResult + '&key=AIzaSyBmgnlyqWd6hYWztLA-_gM4TgIEx2XGd6s';
            // const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + keyword + '&type=video&maxResults=' + maxResult + '&key=AIzaSyA2Cyb_5A9hMOylg1aAqCBSbsaUfYnHMEA';
            const data = await fetch(baseUrl);
            const json = await data.json();
            const result = json.items;

            if (Array.isArray(result)) {

                for (let i = 0; i < result.length; i++) {
                    const form = {
                        videoId: result[i].id.videoId,
                        title: result[i].snippet.title,
                        description: result[i].snippet.description,
                        channelTitle: result[i].snippet.channelTitle,
                        thumbnail: result[i].snippet.thumbnails.high.url,
                        viewCount: 0,
                        uploadDate: result[i].snippet.publishedAt
                    };
                    dispatch(callVideoInsertAPI({form}));
                }
                return result;
            } else {
                console.error('result is not an array:', result);
            }
        } catch (error) {
            console.error('API 호출 실패:', error);
        }
    }
}

export async function searchNewVideos(keyword, dispatch, num, foundVideos, filtering) {

    // AIzaSyBmgnlyqWd6hYWztLA-_gM4TgIEx2XGd6s (수민)
    // AIzaSyDhnTEJd1zHHo-o98rsn51pHTYX8mbPI4I (성경님)

    // 추가 API 
    // AIzaSyA2Cyb_5A9hMOylg1aAqCBSbsaUfYnHMEA (성경님)
    // AIzaSyBgFSJpcl_vuWe0oHdP-S59-E_zWIbouto (수민)

    let maxResult = 5;

    if (maxResult <= num) return null; else {
        maxResult = maxResult - num;

        const keywordArray = keyword.split(" : ");
        const keywordArray2 = keyword.split(" - ");
        if (keywordArray[0].length > keywordArray2[0].length)
            keyword = keywordArray2[0];
        else
            keyword = keywordArray[0];

        for (let i = 0; i < foundVideos.length; i++)
        {
            keyword += "- " + foundVideos[i].videoId;
        }

        if (Array.isArray(filtering))
        {
            for (let i = 0; i < filtering.length; i++)
            {
                if (filtering[i].keyword != null)
                    keyword += "- " + filtering[i].keyword;
                else
                    keyword += "- " + filtering[i].videoId;
            }
        }

        try {
            const encodedKeyword = encodeURIComponent(keyword);
            const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodedKeyword + '&type=video&maxResults=' + maxResult + '&key=AIzaSyBmgnlyqWd6hYWztLA-_gM4TgIEx2XGd6s';
            const data = await fetch(baseUrl);
            const json = await data.json();

            if (!Array.isArray(json.items)) {
            console.error("YouTube API 에러:", json.error || json);
            return null;
            }

            
            const result = json.items;

            if (Array.isArray(result)) {

                for (let i = 0; i < result.length; i++) {
                    const form = {
                        videoId: result[i].id.videoId,
                        title: result[i].snippet.title,
                        description: result[i].snippet.description,
                        channelTitle: result[i].snippet.channelTitle,
                        thumbnail: result[i].snippet.thumbnails.high.url,
                        viewCount: 0,
                        uploadDate: result[i].snippet.publishedAt
                    };
                    dispatch(callVideoInsertAPI({form}));
                }
                return result;
            } else {
                console.error('result is not an array:', result);
            }
        } catch (error) {
            console.error('API 호출 실패:', error);
        }
    }
}

export function getVideosTest(dispatch) {
    // const result = sample.items;
    // for (let i = 0; i < result.length; i++) {
    //     const form = {
    //         videoId: result[i].id.videoId,
    //         title: result[i].snippet.title,
    //         description: result[i].snippet.description,
    //         channelTitle: result[i].snippet.channelTitle,
    //         thumbnail: result[i].snippet.thumbnails.high.url
    //     };
    //     dispatch(callVideoInsertAPI({form}));
    // }

    return sample;
}