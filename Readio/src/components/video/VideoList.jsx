import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNewVideos, getVideosByKeyword } from "../../apis/VideoAPI.js";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VIdeoInDB from "./VIdeoInDB.jsx";
import VideoListCSS from "./videoList.module.css";
import { saveClickLog } from '../../apis/StatisticsAPICalls';

function VideoList({type, userId})
{
    console.log(type);
    const [videoList, setVideoList] = useState([]);
    const [videoInDBList, setVideoInDBList] = useState([]);
    const [videoListTitle, setVideoListTitle] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 추가 !

    // const typeId = type.typeId;

    useEffect(() => {

        let text;
        if (type.typeId >= 6)
        {
            text = userId + type.typeText;
        }
        else
        {
            text = type.typeText;
        }
            setVideoListTitle(text);

        const getVideos = async () => {
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
                    if(type.typeId === 5 || type.typeId === 6 || type.typeId === 7 || type.typeId === 9)
                    {
                        newKeyword = keyword + " 도서";
                        console.log("keyword:", newKeyword, "typeId:", type.typeId, "text:", text);
                    }
                    let result1;
                    let result2;
                    const getVideosAwait = await getVideosByKeyword(type.typeId, keyword, dispatch);
                    if (getVideosAwait)
                    {
                        result1 = getVideosAwait.videoDTOList.filter((video, index, self) =>
                            index === self.findIndex(v => v.videoId === video.videoId));
                        allVideosInDB.push(...result1); // 배열에 쌓기
                    }
                    const getNewVideoAwait = await getNewVideos(type.typeId, newKeyword, dispatch, getVideosAwait? getVideosAwait.num : 0, allVideosInDB);
                    if (getNewVideoAwait)
                    {
                        result2 = getNewVideoAwait.filter((video, index, self) =>
                            index === self.findIndex(v => v.id.videoId === video.id.videoId));
                        allVideos.push(...result2);
                    }
                }
                setVideoInDBList(allVideosInDB); // 딱 한 번만 상태 갱신
                setVideoList(allVideos);
            }
        }
        getVideos();
    }, [type]);

    const scrollRef = useRef();
    const leftButtonHandler = () => {
        scrollRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }

    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({ left: 800, behavior: 'smooth' });
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


    return (
        videoInDBList && videoList &&
        <>
            <div className={VideoListCSS.videoContainer}>
                <button className={VideoListCSS.scrollButton} onClick={leftButtonHandler}><img src={leftButton}/></button>
                <div className={VideoListCSS.videoInnerContainer}>
                    <p className={VideoListCSS.videoFont}>{videoListTitle}</p>
                    <div className={VideoListCSS.line}></div>
                    <div className={VideoListCSS.videoList} ref={scrollRef}>

                        {videoList?.map(video => {
                            const vid = video.id.videoId;
                            return (
                                <div
                                    key={vid}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate(`/video/${vid}`)}
                                >
                                    <Video video={video} />
                                </div>
                            );
                        })}
                        {videoInDBList?.map(video => {
                            const vid = video.videoId;
                            return (
                                <div
                                    key={vid}
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