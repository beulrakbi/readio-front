import {useEffect, useRef, useState} from "react";
import {searchNewVideos, searchVideosByKeyword} from "../../apis/VideoAPI";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import VideoInBookCSS from "./Book.module.css";
import {useDispatch} from "react-redux";
import VideoInBookInDB from "./VideoInBookInDB.jsx";
import VideoInBook from "./VideoInBook.jsx";
import {useNavigate} from "react-router-dom";


function VideosInBook({keyword}) {

    const navigate = useNavigate();
    if (keyword) {
        const keywordArray = keyword.split(" - ");
        keyword = keywordArray[0];
    }

    // console.log("keyword", keyword);
    const [videosInDB, setVideosInDB] = useState([]);
    const [videos, setVideos] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getVideos = async () => {
            const inDB = await searchVideosByKeyword(keyword, dispatch);
            setVideosInDB(inDB.data.videoDTOList);
            setVideos(await searchNewVideos(keyword, dispatch, 0));
        }
        getVideos();
    }, [keyword])

    const scrollRef = useRef();
    const leftButtonHandler = () => {
        scrollRef.current.scrollBy({left: -400, behavior: 'smooth'});
    }

    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({left: 400, behavior: 'smooth'});
    }

    return (<>
        <div className={VideoInBookCSS.videoContainer}>
            <button className={VideoInBookCSS.scrollButton} onClick={leftButtonHandler}>
                <img src={leftButton}/>
            </button>
            <div className={VideoInBookCSS.videoInnerContainer}>
                <div className={VideoInBookCSS.videoList} ref={scrollRef}>
                    {videosInDB?.map(video => {
                        return (<div key={video.videoId}
                                     style={{cursor: "pointer"}}
                                     onClick={() => navigate(`/video/${video.videoId}`)}>
                                <VideoInBookInDB key={video.videoId} videoInDB={video}/>
                            </div>)
                    })}
                    {videos?.map(video => {
                        return (<div key={video.id.videoId}
                                     style={{cursor: "pointer"}}
                                     onClick={() => navigate(`/video/${video.id.videoId}`)}>
                                <VideoInBook key={video.id.videoId} video={video}/>
                            </div>)
                    })}
                </div>
            </div>
            <button className={VideoInBookCSS.scrollButton} onClick={rightButtonHandler}>
                <img src={rightButton}/>
            </button>
        </div>
    </>)
}

export default VideosInBook;
