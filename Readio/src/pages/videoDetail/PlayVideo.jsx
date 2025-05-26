// 영상 상세페이지 - 영상 재생 / 영상 상세 글 부분
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNewVideos } from '../../apis/VideoAPI';
import bookMarkO from '../../assets/bookMarkO.png';
import bookMarkX from '../../assets/bookMarkX.png';
import styles from './PlayVideo.module.css';
import RecommandedVideoList from './RecommandedVideoList';


     function PlayVideo() { 

          const { videoId } = useParams();

          const [isBookmarked, setIsBookmarked] = useState(true); 
          const [bookmarkCount, setBookmarkCount] = useState(15); // 초기 북마크 수 ()
          const [videoInfo, setVideoInfo] = useState(null); // 선택된 비디오 정보 
          
               console.log('북마크 버튼 활성화');

               //  useEffect(() => {
               //      const videos = getNewVideos.items;
               //      const selected = videos.find(v => v.id.videoId === videoId);
               //      setVideoInfo(selected);
               // }, [videoId]);

               useEffect(() => {
                    const fetchVideo = async () => {
                         try {
                              const result = await getNewVideos("기타", "", null, 0); // "기타" 카테고리 영상
                              console.log("getNewVideos 결과:", result);

                              const videos = result.items || result; // items 배열이 있으면 사용
                              const selected = videos.find(v => v.id.videoId === videoId);
                              
                              if (!selected) {
                                   console.warn("해당 videoId를 가진 영상을 찾을 수 없습니다.");
                              }

                              setVideoInfo(selected);
                         } catch (error) {
                              console.error("비디오 로딩 실패:", error);
                         }
                    };

                    fetchVideo();
               }, [videoId]);


               
               const handleImageClick = () => {
                    console.log('북마크 버튼 활성화');

                    if (isBookmarked) {
                         setBookmarkCount(prev => prev + 1); // 북마크 비활성화
                    } else {
                         setBookmarkCount(prev => prev - 1); // 북마크 활성화
                    }


                    setIsBookmarked(!isBookmarked);
               }; // true => bookMark X / false => bookMark O

               if (!videoInfo) return <div>로딩 중...</div>;
               

          return(
               <>

               <div className={styles.backgroundTexture}>
                    <div className={styles.container}>
                         <div className={styles.video}> {/* video 박스 */}
                                   <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                   ></iframe>
                         </div> 
                         <div className={styles.videoInfo}>
                              <div className={styles.videoTitle}> 
                                        {/* 출퇴근하며 19권 읽은 대학생의 여름 책 추천 📚 지하철에서 독서하는 습관 잡기(●'◡'●) */}
                                        {videoInfo.snippet.title}
                              </div> {/*videoTitle 영역 끝 */}
                              <div className={styles.channelNameBookMark}>
                                   <div className={styles.channelName}>
                                        {/* 웰밍whelming */}
                                        {videoInfo.snippet.channelTitle}
                                   </div>
                                   <div className={styles.BookMark}>
                                        북마크 {bookmarkCount}
                                        <img 
                                             src={isBookmarked ? bookMarkX : bookMarkO}
                                             alt="BookMark"
                                             onClick={handleImageClick}
                                             className={styles.bookmark}
                                        />
                                   </div>
                              </div> {/* channelNameBookMark */}
                         </div> {/* videoInfo 영역 끝 */}
                         <div className={styles.videoDetail}> 
                              {videoInfo.snippet.description}
                         </div> {/* videoDetail 영역 끝 */}
                         
                         <RecommandedVideoList />          

                    </div> {/* container 영역 끝 */}

               </div>
               </>
          )
     }

export default PlayVideo;