import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNewVideos, getVideosByKeyword } from "../../apis/VideoAPI.js";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VIdeoInDB from "./VIdeoInDB.jsx";
import VideoListCSS from "./videoList.module.css";

function VideoList({type, userCoords, userId})
// function VideoList({type})
{
    // console.log(type);
    console.log("VideoList props:", type, "userCoords:", userCoords, "userId:", userId);
    const [videoList, setVideoList] = useState([]);
    const [videoInDBList, setVideoInDBList] = useState([]);
    const [videoListTitle, setVideoListTitle] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 추가 ! 

    // const typeId = type.typeId;

    useEffect(() => {
        const getVideos = async () => {
            // --- 1) 날씨 기반 추천 처리 (type.typeId === 5) ---
            if (type.typeId === 5) {
                setVideoListTitle(type.typeText); // 제목 우선 설정
                // if (!userCoords) {
                //     console.log("날씨 추천: userCoords가 없습니다. 위치 허용을 기다립니다.");
                //     setVideoInDBList([]); // 날씨 정보 없으면 빈 배열
                //     setVideoList([]);
                //     return;
                // }
                try {
                    console.log(`날씨 추천 API 호출: lat=${userCoords.lat}, lon=${userCoords.lon}`);
                    const res = await fetch(
                        // 새로운 API 엔드포인트 사용
                        `http://localhost:8080/video/weather?lat=${userCoords.lat}&lon=${userCoords.lon}`
                    );
                    if (!res.ok) {
                        // API 호출 실패 시 (예: 4xx, 5xx 에러)
                        console.error("날씨 기반 추천 API 호출 실패:", res.status);
                        const errorJson = await res.json().catch(() => null); // 에러 응답이 JSON 형태일 수 있음
                        console.error("에러 내용:", errorJson);
                        setVideoInDBList([]);
                        setVideoList([]);
                        return;
                    }
                    const json = await res.json();
                    
                    // 변경된 응답 구조에서 날씨 추천 비디오 목록 가져오기
                    // json.data가 { weatherRecommendedVideos: VideosDTO, allCurations: List<CurationDTO> } 형태
                    const weatherRecommendedVideosDTO = json.data?.weatherRecommendedVideos;
                    const weatherVideos = weatherRecommendedVideosDTO?.videoDTOList || [];
                    
                    console.log("날씨 추천 영상 목록:", weatherVideos);

                    // 날씨 추천 결과는 DB에 있는 비디오들이므로 videoInDBList에 설정
                    setVideoInDBList(weatherVideos);
                    setVideoList([]); // YouTube API 직접 검색 결과는 없음

                } catch (err) {
                    console.error("날씨 기반 추천 처리 중 에러:", err);
                    setVideoInDBList([]);
                    setVideoList([]);
                }
                return; // 날씨 처리 후 종료
            }

             // <<<--- 감정 기반 추천 처리 (type.typeId === 'emotionBased') --- >>>
            if (type.typeId === 'emotionBased') {
                if (!userId) { // userId가 없으면 감정 추천을 하지 않음
                    console.log("감정 기반 추천: userId가 없어 추천을 생략합니다.");
                    setVideoInDBList([]);
                    setVideoList([]);
                    return;
                }



                try {
                    console.log(`감정 기반 추천 API 호출: userId=${userId}`);
                    const requestURL = `http://localhost:8080/video/recommendation/emotion?userId=${encodeURIComponent(userId)}`;
                    const res = await fetch(requestURL);

                    if (!res.ok) {
                        console.error("감정 기반 추천 API 호출 실패:", res.status);
                        const errorJson = await res.json().catch(() => null);
                        console.error("에러 내용:", errorJson);
                        setVideoInDBList([]);
                        setVideoList([]);
                        return;
                    }
                    const json = await res.json(); // 백엔드 ResponseDTO 전체
                    
                    // 백엔드에서 반환하는 ResponseDTO의 data 필드가 VideosDTO라고 가정
                    const emotionVideosData = json.data; 
                    const emotionVideos = emotionVideosData?.videoDTOList || [];
                    
                    setVideoInDBList(emotionVideos);
                    setVideoList([]); // YouTube API 직접 검색 결과는 없음
                    console.log("감정 기반 추천 영상 목록:", emotionVideos);

                } catch (err) {
                    console.error("감정 기반 추천 처리 중 에러:", err);
                    setVideoInDBList([]);
                    setVideoList([]);
                }
                return; // 감정 기반 처리 후 종료
            }
            // <<<--- 추가된 부분 끝 --->>>



            // --------------
            const keywords = await fetch(`http://localhost:8080/curation/${type.typeId}`)
                .then(response => response.json())
                .then(response => response.data)
                .then(response => response.curationKeywords);
            console.log("keywords", keywords);
            if (keywords.length > 0) {
                const allVideosInDB = [];
                const allVideos = [];

                for (let i = 0; i < keywords.length; i++) {
                    const keyword = keywords[i].keyword;
                    const getVideosAwait = await getVideosByKeyword(type.typeId, keyword, dispatch);
                    const videosInDB = getVideosAwait?.data.videoDTOList;
                    const getNewVideoAwait = await getNewVideos(type.typeId, keyword, dispatch, videosInDB? videosInDB.length : 0);
                    if (videosInDB)
                    {
                        const result = videosInDB.filter((video, index, self) =>
                            index === self.findIndex(v => v.videoId === video.videoId));
                        allVideosInDB.push(...result); // 배열에 쌓기
                    }
                    if (getNewVideoAwait)
                    {
                        const result = getNewVideoAwait.filter((video, index, self) =>
                            index === self.findIndex(v => v.id.videoId === video.id.videoId));
                        allVideos.push(...result);
                    }

                     // <<<--- 중복 키 오류 방지를 위해 전체 리스트 레벨에서 추가 중복 제거 --->>>
                    const uniqueVideosInDB = Array.from(
                        new Map(allVideosInDB.map((v) => [v.videoId, v])).values()
                    );
                    const uniqueVideos = Array.from(
                        new Map(allVideos.map((v) => [v.id.videoId, v])).values()
                    );

                setVideoInDBList(uniqueVideosInDB);
                setVideoList(uniqueVideos);
                setVideoListTitle(type.typeText);
                }
                setVideoInDBList(allVideosInDB); // 딱 한 번만 상태 갱신
                setVideoList(allVideos);
                setVideoListTitle(type.typeText);
            }
        }
        getVideos();
    }, [type, userCoords, userId, dispatch]);

    const scrollRef = useRef();
    const leftButtonHandler = () => {
        scrollRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }

    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({ left: 800, behavior: 'smooth' });
    }

     // <<<--- 추가된 부분 시작: 빈 목록일 때 메시지 표시를 위한 변수 --- >>>
    const isEmptyList = videoList.length === 0 && videoInDBList.length === 0; 
    // <<<--- 추가된 부분 끝 --- >>>


    return (
        <>
            <div className={VideoListCSS.videoContainer}>
            <button className={VideoListCSS.scrollButton} onClick={leftButtonHandler}><img src={leftButton}/></button>
                <div className={VideoListCSS.videoInnerContainer}>
                <p className={VideoListCSS.videoFont}>{videoListTitle}</p>
                <div className={VideoListCSS.line}></div>
                <div className={VideoListCSS.videoList} ref={scrollRef}>

                    {videoList?.map((video, idx) => {
                       const vid = video.id.videoId;
                        return (
                            <div
                                key={`${vid}-${idx}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/video/${vid}`)}
                           >
                                <Video video={video} />
                            </div>
                        );
                    })}
                    {videoInDBList?.map((video, idx) => {
                        const vid = video.videoId;
                        return (
                            <div
                                key={`${vid}-${idx}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/video/${vid}`)}
                            >
                                <VIdeoInDB videoInDB={video} />
                            </div>
                        );
                    })}



                </div>
                <div className={VideoListCSS.line}></div>
                </div>
                <button className={VideoListCSS.scrollButton} onClick={rightButtonHandler}><img src={rightButton}/></button>
            </div>
        </>
    )
}

export default VideoList;