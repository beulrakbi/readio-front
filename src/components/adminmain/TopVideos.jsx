import { useEffect, useRef, useState } from 'react';
import { getVideosTest } from '../../apis/VideoAPI';
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import AdminMainCSS from './adminmain.module.css';
import TopVideo from './TopVideo';


function TopVideos()
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
        <div className={AdminMainCSS.main}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>클릭 수 및 북마크가 많은 영상</p>
            </div>
            <hr className={AdminMainCSS.csLine}/>
            <div className={AdminMainCSS.videoContainer}>
                <button className={AdminMainCSS.scrollButton} onClick={leftButtonHandler}><img className={AdminMainCSS.buttonImg} src={leftButton}/></button>
                <div className={AdminMainCSS.videoList} ref={scrollRef}>
                    {videoList.map(video => {return <TopVideo key={video.etag} video={video}/>})}
                </div>
                <button className={AdminMainCSS.scrollButton} onClick={rightButtonHandler}><img className={AdminMainCSS.buttonImg} src={rightButton}/></button>
            </div>
            <hr className={AdminMainCSS.csLine}/>
        </div>
    )
}

export default TopVideos;