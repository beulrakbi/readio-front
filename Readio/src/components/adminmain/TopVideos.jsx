import { useEffect, useRef, useState } from 'react';
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import AdminMainCSS from './adminmain.module.css';
import TopVideo from './TopVideo';
import { getClickAnalytics } from '../../apis/StatisticsAPICalls';
import {Link} from 'react-router-dom';

function TopVideos() {
    const [videoList, setVideoList] = useState([]);

    useEffect(() => {
        const fetchTopVideos = async () => {
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            const format = (d) => d.toISOString().slice(0, 10);

            try {
                const rawData = await getClickAnalytics({
                    type: 'video',
                    sort: 'click',
                    startDate: format(oneWeekAgo),
                    endDate: format(today),
                    limit: 10
                });

                console.log("TopVideos 응답:", rawData);

                const topVideos = rawData.list || [];
                setVideoList(topVideos);
            } catch (e) {
                console.error("TopVideos 불러오기 실패:", e);
            }
        };

        fetchTopVideos();
    }, []);


    const scrollRef = useRef();
    const leftButtonHandler = () => scrollRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    const rightButtonHandler = () => scrollRef.current.scrollBy({ left: 800, behavior: 'smooth' });

    return (

        <div className={AdminMainCSS.main2}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>최근 일주일 클릭 수 Top10 영상</p>
                <Link to="/admin/analytics/clicklog" className={AdminMainCSS.linkFont}>더보기 &gt;</Link>
            </div>

            <hr className={AdminMainCSS.csLine2} />
            <div className={AdminMainCSS.videoContainer}>
                <button className={AdminMainCSS.scrollButton} onClick={leftButtonHandler}>
                    <img className={AdminMainCSS.buttonImg} src={leftButton} />
                </button>
                <div className={AdminMainCSS.videoList} ref={scrollRef}>
                    {videoList.map((video, idx) => (
                        <TopVideo key={video.contentId || idx} video={video} />
                    ))}
                </div>
                <button className={AdminMainCSS.scrollButton} onClick={rightButtonHandler}>
                    <img className={AdminMainCSS.buttonImg} src={rightButton} />
                </button>
            </div>
            <hr className={AdminMainCSS.csLine2} />
        </div>
    );
}

export default TopVideos;
