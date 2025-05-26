import {useEffect, useRef, useState} from 'react';
import {getTopVideos, getVideosTest} from '../../apis/VideoAPI';
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import AdminMainCSS from './adminmain.module.css';
import TopVideo from './TopVideo';
import {useDispatch} from "react-redux";


function TopVideos() {

    const [videoList, setVideoList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getVideosInDB = async () => {
            const allVideosInDB = [];
            const getVideosAwait = await getTopVideos(dispatch);
            const videosInDB = getVideosAwait?.data.videoDTOList;
            if (videosInDB) {
                allVideosInDB.push(...videosInDB); // 배열에 쌓기
                allVideosInDB.filter((video, index, self) => index === self.findIndex(v => v.videoId === video.videoId));
            }
            setVideoList(allVideosInDB);
        }
        getVideosInDB();
    }, []);

    const scrollRef = useRef();
    const leftButtonHandler = () => {
        scrollRef.current.scrollBy({left: -800, behavior: 'smooth'});
    }

    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({left: 800, behavior: 'smooth'});
    }

    return (<div className={AdminMainCSS.main}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>클릭 수 및 북마크가 많은 영상</p>
            </div>
            <hr className={AdminMainCSS.csLine}/>
            <div className={AdminMainCSS.videoContainer}>
                <button className={AdminMainCSS.scrollButton} onClick={leftButtonHandler}><img
                    className={AdminMainCSS.buttonImg} src={leftButton}/></button>
                <div className={AdminMainCSS.videoList} ref={scrollRef}>
                    {videoList.map(video => {
                        return <TopVideo key={video.id} video={video}/>
                    })}
                </div>
                <button className={AdminMainCSS.scrollButton} onClick={rightButtonHandler}><img
                    className={AdminMainCSS.buttonImg} src={rightButton}/></button>
            </div>
            <hr className={AdminMainCSS.csLine}/>
        </div>)
}

export default TopVideos;