import { useEffect, useRef, useState } from "react";
import { getVideosTest } from "../../apis/VideoAPI";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import Video from "./Video";
import VideoListCSS from "./videoList.module.css";
import {useDispatch, useSelector} from "react-redux";
import {callCurationsAPI} from "../../apis/CurationAPICalls.js";

function VideoList({type})
{
    const dispatch = useDispatch();
    const keywords = useSelector(state => state.curation);
    console.log("keywords", keywords);
    const [videoList, setVideoList] = useState([]);


    useEffect(
        () => {
            dispatch(callCurationsAPI({type}));
            setVideoList(getVideosTest().items);
            console.log("test", videoList);
        },[]
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