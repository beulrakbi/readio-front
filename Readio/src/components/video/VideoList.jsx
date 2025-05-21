import { useEffect, useRef, useState } from "react";
import {getVideosByKeyword, getVideosTest} from "../../apis/VideoAPI";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VideoListCSS from "./videoList.module.css";
import {useDispatch, useSelector} from "react-redux";
import {callCurationsAPI} from "../../apis/CurationAPICalls.js";

function VideoList({type})
{
    const [videoList, setVideoList] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            const keywords = await fetch(`http://localhost:8080/curation/${type}`)
                .then(response => response.json())
                .then(response => response.data);
            console.log("keywords", keywords);
            if (keywords.length > 0) {
                const allVideos = [];

                for (let i = 0; i < keywords.length; i++) {
                    const keyword = keywords[i].keyword;
                    // const videos = await getVideosByKeyword(type, keyword);
                    // allVideos.push(...videos); // 배열에 쌓기
                }

                // setVideoList(allVideos); // 딱 한 번만 상태 갱신
            }
        };

        getVideos();
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
        scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
    
    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
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
                </div>
                <div className={VideoListCSS.line}></div>
                </div>
                <button className={VideoListCSS.scrollButton} onClick={rightButtonHandler}><img src={rightButton}/></button>
            </div>
        </>
    )
}

export default VideoList;