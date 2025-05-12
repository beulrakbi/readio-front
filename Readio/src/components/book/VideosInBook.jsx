import { useEffect, useRef, useState } from "react";
import { getVideosTest } from "../../apis/VideoAPI";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import VideoInBookCSS from "./Book.module.css";
import VideoInBook from "./VideoInBook";


function VideosInBook()
{
    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        setVideos(getVideosTest().items);
    }, [])
    
    const scrollRef = useRef();
    const leftButtonHandler = () => {
        scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
    
    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
    
    return (
        <>
            <div className={VideoInBookCSS.videoContainer}>
                <button className={VideoInBookCSS.scrollButton} onClick={leftButtonHandler}><img src={leftButton}/></button>
                <div className={VideoInBookCSS.videoInnerContainer}>
                    <div className={VideoInBookCSS.videoList} ref={scrollRef}>
                        {videos.map(video => {return <VideoInBook key={video.etag} video={video}/>})}
                    </div>
                </div>
                <button className={VideoInBookCSS.scrollButton} onClick={rightButtonHandler}><img src={rightButton}/></button>
            </div>
        </>
    )
}

export default VideosInBook;
