import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNewVideos, getVideosByKeyword } from "../../apis/VideoAPI.js";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VIdeoInDB from "./VIdeoInDB.jsx";
import VideoListCSS from "./videoList.module.css";

function VideoList({type})
{
    console.log(type);
    const [videoList, setVideoList] = useState([]);
    const [videoInDBList, setVideoInDBList] = useState([]);
    const [videoListTitle, setVideoListTitle] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // 추가 ! 

    // const typeId = type.typeId;

    useEffect(() => {
        const getVideos = async () => {
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
                }
                setVideoInDBList(allVideosInDB); // 딱 한 번만 상태 갱신
                setVideoList(allVideos);
                setVideoListTitle(type.typeText);
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

    return (
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