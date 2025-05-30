// 영상 상세페이지 - 관련 콘텐츠 추천 부분
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchNewVideos } from '../../apis/VideoAPI';
import styles from './RecommandedVideoList.module.css';

function RecommandedVideoList({keyword}){

     const [list, setList] = useState([]);
     const navigate = useNavigate();
     const dispatch = useDispatch();

     useEffect(() => {
          if (!keyword) return;

          const fetchRecommanded = async () => {
               try {
                    const result = await searchNewVideos(keyword, dispatch, 0); 
                    if (Array.isArray(result)) {
                         setList(result);
                    } else {
                         console.warn('추천 영상 없음');
                    }
               } catch (err) {
                    console.error(err);
               }
          };

          fetchRecommanded();
     }, [keyword, dispatch]);

     if(!list.length) return null; 


     return (
          <div className={styles.List}>
               <div className={styles.Title}># 관련 콘텐츠 추천</div>
               {list.map(video => (
               <div
                    key={video.id.videoId}
                    className={styles.videoList}
                    onClick={() => navigate(`/video/${video.id.videoId}`)} // 상세 페이지로 이동
               >
                    <div className={styles.videoBox}>
                         <img
                              src={video.snippet.thumbnails.high.url}
                              alt={video.snippet.title}
                              className={styles.thumbnail}
                         />
                    </div>
                    <div className={styles.Info}>
                         <div className={styles.videoTitle}>{video.snippet.title}</div>
                         <div className={styles.videoinfo}>{video.snippet.channelTitle}</div>
                         <div className={styles.videoDate}>
                              {video.snippet.publishedAt
                                   .slice(0, 10)
                                   .replace(/-/g, '.')}
                         </div>
                    </div>
               </div>
               ))}
          </div>
     );
}


export default RecommandedVideoList;