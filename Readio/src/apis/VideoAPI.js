import sample from "./test.json";
import {callSearchVideosAPI, callTopVideosAPI, callVideoInsertAPI, callVideosAPI} from "./VideoAPICalls.js";


export async function getVideosByKeyword(type, keyword, dispatch) {

    if (type == "1") {
        const keywordArray = keyword.split(" ");
        keyword = keywordArray[0];
    }
    let result = await dispatch(callVideosAPI({search: keyword}));

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


export async function getNewVideos(type, keyword, dispatch, num) {

    // AIzaSyBmgnlyqWd6hYWztLA-_gM4TgIEx2XGd6s
    // AIzaSyDhnTEJd1zHHo-o98rsn51pHTYX8mbPI4I

    let maxResult = 5;

    if (maxResult <= num) return null; else {

        if (type === "1") {
            keyword = keyword + '|낭독|리뷰'
        }
        maxResult = maxResult - num;

        try {
            const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + keyword + '&type=video&maxResults=' + maxResult + '&key=AIzaSyDhnTEJd1zHHo-o98rsn51pHTYX8mbPI4I';
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

export async function searchNewVideos(keyword, dispatch, num) {

    // AIzaSyBmgnlyqWd6hYWztLA-_gM4TgIEx2XGd6s
    // AIzaSyDhnTEJd1zHHo-o98rsn51pHTYX8mbPI4I

    let maxResult = 5;

    if (maxResult <= num) return null; else {
        maxResult = maxResult - num;

        try {
            const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + keyword + '&type=video&maxResults=' + maxResult + '&key=AIzaSyBmgnlyqWd6hYWztLA-_gM4TgIEx2XGd6s';
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