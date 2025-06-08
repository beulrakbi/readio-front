import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { callFiltersByTypeIdAPI } from "../../apis/FilteringAPICalls.js";
import { saveClickLog } from '../../apis/StatisticsAPICalls';
import { getNewVideos, getVideosByKeyword } from "../../apis/VideoAPI.js";
import { callVideoInsertAPI } from "../../apis/VideoAPICalls.js";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VIdeoInDB from "./VIdeoInDB.jsx";
import VideoListCSS from "./videoList.module.css";

function VideoList({type, userCoords, userId}) {

    const [videoList, setVideoList] = useState([]);
    const [videoInDBList, setVideoInDBList] = useState([]);
    const [videoListTitle, setVideoListTitle] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const OPENWEATHER_KEY = "52003f931a0d81375dba797857ece5da";

    const mapWeatherToKeyword = (weatherMain) => {
        switch (weatherMain) {
                case "Clear":
                    return ["맑은날", "산책", "야외활동", "햇살", "기분좋은", "운동", "드라이브"];
                case "Clouds":
                    return ["흐린날", "잔잔한", "여유", "차분한"];
                case "Rain":
                case "Drizzle":
                case "Thunderstorm":
                    return ["비오는날", "실내", "감성", "차가운"];
                case "Snow":
                    return ["눈오는날", "겨울", "포근한", "눈사람", "크리스마스"];
                case "Mist":
                case "Fog":
                case "Haze":
                case "Smoke":
                case "Dust":
                    return ["안개낀날", "신비로운", "몽환적", "집중"];
                default:
                    return [];
            }
    };

    const getVideos = async (filters) => {

                if (type.typeId === 5) {

                        if (!userCoords) return;

                        try {
                                // OpenWeatherMap API 호출
                                const { lat, lon } = userCoords;
                                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&lang=kr`;
                                
                                const weatherRes = await fetch(weatherUrl);
                                if (!weatherRes.ok) {
                                    console.error("OpenWeatherMap 호출 실패:", weatherRes.status);
                                    setVideoInDBList([]);
                                    setVideoList([]);
                                    return;
                                }

                                const weatherJson = await weatherRes.json();
                                const weatherMain = weatherJson.weather?.[0]?.main || "";
                                console.log("현재 날씨 (weatherMain):", weatherMain);

                                // 날씨 메인 코드를 DB에 저장된 후보 키워드 리스트로 매핑
                                const candidates = mapWeatherToKeyword(weatherMain); 
                                if (candidates.length === 0) {
                                    setVideoInDBList([]);
                                    setVideoList([]);
                                    return;
                                }

                                // 키워드 결합
                                const keywords = candidates.map(c => `${c} 도서`);

                                // 키워드별 DB 조회 및 축적
                                const allDB = [];
                                const allYt = [];
                                for (let kw of keywords) {
                                    // DB에서 조회
                                    const dbRes = await getVideosByKeyword(type.typeId, kw, dispatch);
                                    const dbList = Array.isArray(dbRes?.videoDTOList)
                                        ? dbRes.videoDTOList.filter((v, i, self) => i === self.findIndex(x => x.videoId === v.videoId))
                                        : [];
                                    allDB.push(...dbList);

                                    // 유튜브 API 조회 (DB에 없는 만큼)
                                    const numInDB = dbList.length;
                                    const ytList = await getNewVideos(
                                        type.typeId,
                                        kw,
                                        dispatch,
                                        numInDB,
                                        dbList,
                                        filters
                                    ) || [];
                                    allYt.push(...ytList);
                                }

                                // 중복 제거
                                const uniqueDB = Array.from(new Map(allDB.map(v => [v.videoId, v])).values());
                                const uniqueYt = Array.from(new Map(allYt.map(v => [v.id.videoId, v])).values());


                                try {
                                    uniqueYt.forEach(video => {
                                        dispatch(callVideoInsertAPI({ form: {
                                        videoId: video.id.videoId,
                                        title: video.snippet.title,
                                        description: video.snippet.description,
                                        channelTitle: video.snippet.channelTitle,
                                        thumbnail: video.snippet.thumbnails.high.url,
                                        viewCount: 0,
                                        uploadDate: video.snippet.publishedAt
                                        }}));
                                    });
                                    } catch (e) {
                                    console.warn("YouTube API error, falling back to DB only", e); // 수정됨
                                    setVideoInDBList(uniqueDB);
                                    setVideoList([]); // 수정됨
                                    return;                  // 수정됨
                                    }

                                // 상태 업데이트
                                setVideoInDBList(uniqueDB);
                                setVideoList(uniqueYt);
                                return;

                            } catch (err) {
                                console.error("프론트엔드 날씨 기반 처리 중 에러:", err);
                                setVideoInDBList(uniqueDB);
                                setVideoList([]);
                                return;
                            }
                }

        // 감정 기반 추천 처리
        if (type.typeId === 6) {

            if (!userId) {
                setVideoInDBList([]);
                setVideoList([]);
                return;
            }

            try {
                console.log(`감정 기반 추천 API 호출: userId=${userId}`);
                // 백엔드 API를 호출하여 DB에 저장된 감정 기반 추천 영상 목록을 가져옴
                const requestURL = `http://localhost:8080/video/recommendation/emotion?userId=${encodeURIComponent(userId)}`;
                const res = await fetch(requestURL);

                if (!res.ok) {
                    console.error("감정 기반 추천 API 호출 실패:", res.status);
                    setVideoInDBList([]);
                    setVideoList([]);
                    return;
                }

                const json = await res.json(); // DB
                const emotionVideos = json.data?.videoDTOList || [];
                console.log("감정 기반 추천 영상 목록 (DB):", emotionVideos);
                setVideoInDBList(emotionVideos); // DB에서 가져온 감정 추천 영상으로 업데이트


                const numInDB = emotionVideos.length; // DB에 이미 있는 영상
                let keyword = type.typeText;  // 검색 키워드
                let newKeyword;


                // 키워드 + "도서"
                if ([5, 6, 7, 9].includes(type.typeId)) {
                    newKeyword = keyword + " 도서";
                    console.log(` 원본: "${keyword}", 최종: "${newKeyword}"`);
                }

                console.log(`감정 기반 YouTube 추가 검색 키워드: "${newKeyword}", DB 영상 개수: ${numInDB}`);

                const newVideos = await getNewVideos(type.typeId,      // 6
                    newKeyword, dispatch, numInDB, emotionVideos, filters) || [];



                    if (newVideos.length === 0) {   // 수정됨
                        console.warn("YouTube API fallback to DB");
                        setVideoInDBList(emotionVideos);
                        setVideoList([]);            // 수정됨
                        return;                      // 수정됨
                    }

                    newVideos.forEach(video => {
                            dispatch(callVideoInsertAPI({
                                form: {
                                    videoId:      video.id.videoId,
                                    title:        video.snippet.title,
                                    description:  video.snippet.description,
                                    channelTitle: video.snippet.channelTitle,
                                    thumbnail:    video.snippet.thumbnails.high.url,
                                    viewCount:    0,
                                    uploadDate:   video.snippet.publishedAt
                                }
                        }));
                    });

                setVideoList(newVideos);
                return;

            } catch (err) {
                console.error("감정 기반 추천 처리 중 에러:", err);
                setVideoInDBList(emotionVideos);
                setVideoList([]);
                return;
            }
        }


        const keywords = await fetch(`http://localhost:8080/curation/keywords/${userId}/${type.typeId}`)
            .then(response => response.json())
            .then(response => response.data)
            .then(response => response.curationKeywords);
        if (keywords.length > 0) {
            const allVideosInDB = [];
            const allVideos = [];

            for (let i = 0; i < keywords.length; i++) {
                let keyword = keywords[i].keyword;
                let newKeyword;

                if (type.typeId === 5 || type.typeId === 6 || type.typeId === 7 || type.typeId === 9) { // typeId 5,6 은 위의 로직에서 처리 이 로직을 타지 않음.
                    newKeyword = keyword + " 도서";
                }

                let result1; // DB 검색 결과
                let result2; // API 검색 결과

                // 각 키워드에 대해 DB에서 영상 검색
                const getVideosAwait = await getVideosByKeyword(type.typeId, keyword, dispatch);
                if (getVideosAwait) {
                    result1 = getVideosAwait.videoDTOList.filter((video, index, self) => index === self.findIndex(v => v.videoId === video.videoId));
                    allVideosInDB.push(...result1);
                }

                const numInDB = getVideosAwait?.num || 0;
                // 각 키워드 및 DB 검색 결과를 바탕으로 YouTube에서 추가 영상 검색
                const getNewVideoAwait = await getNewVideos(type.typeId, newKeyword, dispatch, numInDB, result1 || [], filters); // 수정: allVideosInDB 대신 현재 키워드의 DB결과(result1)를 넘겨야 정확한 제외 검색 가능
                if (getNewVideoAwait) {
                    result2 = getNewVideoAwait.filter((video, index, self) => index === self.findIndex(v => v.id.videoId === video.id.videoId));
                    allVideos.push(...result2);
                }
            }

            // 전체적으로 중복 제거 후 상태 업데이트 (루프 밖으로 이동하여 한 번만 실행)
            const uniqueVideosInDB = Array.from(new Map(allVideosInDB.map((v) => [v.videoId, v])).values());
            const uniqueVideos = Array.from(new Map(allVideos.map((v) => [v.id.videoId, v])).values());

            setVideoInDBList(uniqueVideosInDB);
            setVideoList(uniqueVideos);
        }
    }


    useEffect(() => {

        const fetchAndRun = async () => {
            const filters = await dispatch(callFiltersByTypeIdAPI({typeId: type.typeId}));

            let text;
            if (type.typeId >= 6) {
                text = userId + type.typeText;
            } else {
                text = type.typeText;
            }
            setVideoListTitle(text);

            getVideos(filters);
        };

        fetchAndRun();
    }, [type, userCoords, userId, dispatch]);

    const scrollRef = useRef();
    const leftButtonHandler = () => {
        scrollRef.current.scrollBy({left: -800, behavior: 'smooth'});
    }

    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({left: 800, behavior: 'smooth'});
    }

    function getOrCreateAnonymousUserId() {
        return "guest";
    }


    const handleClickVideo = async (videoId) => {
        // 1. userId 가져오기 or anonymous 생성
        const userId = sessionStorage.getItem("userId") || getOrCreateAnonymousUserId();

        try {
            await saveClickLog({
                contentId: videoId,
                contentType: 'video',
                action: 'click',
                userId: userId,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error(" 클릭 로그 저장 실패:", err);
        }

        navigate(`/video/${videoId}`);
    };


    return (videoInDBList && videoList && <>
            <div className={VideoListCSS.videoContainer}>
                <button className={VideoListCSS.scrollButton} onClick={leftButtonHandler}><img src={leftButton}/>
                </button>
                <div className={VideoListCSS.videoInnerContainer}>
                    <p className={VideoListCSS.videoFont}>{videoListTitle}</p>
                    <div className={VideoListCSS.line}></div>
                    <div className={VideoListCSS.videoList} ref={scrollRef}>

                        {videoList?.map(video => {
                            const vid = video.id.videoId;
                            return (<div
                                    key={vid}
                                    style={{cursor: "pointer"}}
                                    onClick={() => navigate(`/video/${vid}`)}
                                >
                                    <Video video={video}/>
                                </div>);
                        })}
                        {videoInDBList?.map(video => {
                            const vid = video.videoId;
                            return (<div
                                    key={vid}
                                    style={{cursor: "pointer"}}
                                    onClick={() => navigate(`/video/${vid}`)}
                                >
                                    <VIdeoInDB videoInDB={video}/>
                                </div>);
                        })}


                    </div>
                    <div className={VideoListCSS.line}></div>
                </div>
                <button className={VideoListCSS.scrollButton} onClick={rightButtonHandler}><img src={rightButton}/>
                </button>
            </div>
        </>)
}

export default VideoList;