import { useEffect, useRef, useState } from "react";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VideoListCSS from "./videoList.module.css";
import {getNewVideos, getVideosByKeyword} from "../../apis/VideoAPI.js";
import {useDispatch} from "react-redux";
import VIdeoInDB from "./VIdeoInDB.jsx";

function VideoList({type})
{
    const [videoList, setVideoList] = useState([]);
    const [videoInDBList, setVideoInDBList] = useState([]);
    const dispatch = useDispatch();
    let keyword = null;

    useEffect(() => {
        const getVideosInDB = async () => {
            const keywords = await fetch(`http://localhost:8080/curation/${type}`)
                .then(response => response.json())
                .then(response => response.data);
            if (keywords.length > 0) {
                const allVideosInDB = [];
                const allVideos = [];

                for (let i = 0; i < keywords.length; i++) {
                    keyword = keywords[i].keyword;
                    const getVideosAwait = await getVideosByKeyword(type, keyword, dispatch);
                    const videosInDB = getVideosAwait?.data.videoDTOList;
                    const getNewVideoAwait = await getNewVideos(type, keyword, dispatch, videosInDB? videosInDB.length : 0);
                    if (videosInDB)
                    {
                        allVideosInDB.push(...videosInDB); // 배열에 쌓기
                        allVideosInDB.filter((video, index, self) =>
                            index === self.findIndex(v => v.videoId === video.videoId));
                    }
                    if (getNewVideoAwait)
                    {
                        allVideos.push(...getNewVideoAwait);
                        allVideos.filter((video, index, self) =>
                            index === self.findIndex(v => v.id.videoId === video.id.videoId));
                    }
                }
                setVideoInDBList(allVideosInDB); // 딱 한 번만 상태 갱신
                setVideoList(allVideos)
            }
        }
        getVideosInDB();
    }, [type]);

    let videoListTitle;

    if (type === "연예인")
        videoListTitle = "💫연예인 작가 모음🎵";
    else if (type === "독서방법")
        videoListTitle = "👓독서 꿀팁 및 독서 방법 모음📕";
    else if (type === "굿즈")
        videoListTitle = "💸독서 꿀템 및 악세사리 굿즈 모음🎁";


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
                    {videoList?.map(video => {return <Video key={video.id.videoId} video={video}/>})}
                    {videoInDBList?.map(video => {return <VIdeoInDB key={video.videoId} videoInDB={video}/>})}
                </div>
                <div className={VideoListCSS.line}></div>
                </div>
                <button className={VideoListCSS.scrollButton} onClick={rightButtonHandler}><img src={rightButton}/></button>
            </div>
        </>
    )
}

export default VideoList;