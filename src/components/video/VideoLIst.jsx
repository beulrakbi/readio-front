import { useEffect, useRef, useState } from "react";
import { getVideosTest } from "../../apis/VideoAPI";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VideoListCSS from "./videoList.module.css";

function VideoList()
{
    const [videoList, setVideoList] = useState([]);

    useEffect(
        () => {
            // getVideos.then(data => setVideoList(data));
            // fetch(sample).then(data => setVideoList(data.items));
            setVideoList(getVideosTest().items);
            console.log("test", videoList);
        }
    )

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
                <p className={VideoListCSS.videoFont}>인기 TOP 5</p>
                <div className={VideoListCSS.line}></div>
                <div className={VideoListCSS.videoList} ref={scrollRef}>
                    {videoList.map(video => {return <Video key={video.etag} video={video}/>})}
                </div>
                <div className={VideoListCSS.line}></div>
                </div>
                <button className={VideoListCSS.scrollButton} onClick={rightButtonHandler}><img src={rightButton}/></button>
            </div>
        </>
    )
}

export default VideoList;