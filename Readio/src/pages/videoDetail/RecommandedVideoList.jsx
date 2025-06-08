import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getVideosBySearchOnly, searchNewVideos } from '../../apis/VideoAPI';
import styles from './RecommandedVideoList.module.css';

const MAX_RECOMMEND = 10;

function RecommandedVideoList({ keyword }) {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!keyword) return;

    // 원본 제목 로그
    console.log('넘어온 키워드 :', keyword);

    const cleaned = keyword
          .replace(/\[.*?\]/g, '')        
          .trim()                        
          .split(/[\s:\-\–\|\/]+/)[0]     
          .trim();                        
    console.log('최종 검색 키워드 :', cleaned);

    const fetchRecommanded = async () => {
      try {
        // DB에서 먼저 조회 (검색 전용 API 사용)
        const dbRes = await getVideosBySearchOnly(cleaned, dispatch);
        const dbList = Array.isArray(dbRes?.data?.videoDTOList)
          ? dbRes.data.videoDTOList
          : [];

        // 부족분만큼 YouTube API 호출
        const need = MAX_RECOMMEND - dbList.length;
        let apiList = [];
        if (need > 0) {
          apiList = await searchNewVideos(cleaned, dispatch, dbList.length, dbList, []);
          apiList = Array.isArray(apiList) ? apiList : [];
        }

        // 공통 포맷 결합
        const dbCommon = dbList.map(v => ({
          id: v.videoId,
          title: v.title,
          channel: v.channelTitle,
          thumbnail: v.thumbnail,
          date: v.uploadDate,
        }));
        const apiCommon = apiList.map(v => ({
          id: v.id.videoId,
          title: v.snippet.title,
          channel: v.snippet.channelTitle,
          thumbnail: v.snippet.thumbnails.high.url,
          date: v.snippet.publishedAt.slice(0, 10).replace(/-/g, '.'),
        }));

        setList([...dbCommon, ...apiCommon].slice(0, MAX_RECOMMEND));
      } catch (err) {
        console.error('추천 영상 조회 중 오류:', err);
        setList([]);
      }
    };

    fetchRecommanded();
  }, [keyword, dispatch]);

  if (!list.length) return null;

  return (
    <div className={styles.List}>
      <div className={styles.Title}># 관련 콘텐츠 추천</div>
      {list.map(video => (
        <div
          key={video.id}
          className={styles.videoList}
          onClick={() => navigate(`/video/${video.id}`)}
        >
          <div className={styles.videoBox}>
            <img src={video.thumbnail} alt={video.title} className={styles.thumbnail} />
          </div>
          <div className={styles.Info}>
            <div className={styles.videoTitle}>{video.title}</div>
            <div className={styles.videoinfo}>{video.channel}</div>
            <div className={styles.videoDate}>{video.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecommandedVideoList;
