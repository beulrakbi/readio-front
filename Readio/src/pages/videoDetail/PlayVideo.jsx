import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bookMarkO from '../../assets/bookMarkO.png';
import bookMarkX from '../../assets/bookMarkX.png';
import styles from './PlayVideo.module.css';
import RecommandedVideoList from './RecommandedVideoList';

     function PlayVideo() { 

          const { videoId } = useParams();

          const [error, setError] = useState(null); // 에러 상태 추가

          const [isBookmarked, setIsBookmarked] = useState(true); 
          const [bookmarkCount, setBookmarkCount] = useState(15); // 초기 북마크 수 설정 => 15
          const [videoInfo, setVideoInfo] = useState(null); // 선택된 비디오 정보 

          const [hasPlayed, setHasPlayed] = useState(false); // 영상 재생 여부 상태 확인
          
               console.log('북마크 버튼 활성화');

                useEffect(() => {
                    const fetchVideoFromDB = async () => {
                         try {
                              const res = await fetch(`http://localhost:8080/video/id/${videoId}`); 
                         if (!res.ok) throw new Error(`Status ${res.status}`);         
                              const resDto = await res.json();
                              setVideoInfo(resDto.data);      // ResponseDTO.data 에 담긴 VideoDTO 사용
                         } catch (err) {
                              console.error(err);
                              setError(err.message);         // 에러 메시지 상태에 저장
                         }
                    };
                    fetchVideoFromDB();
                    }, [videoId]);

                    // 에러 UI 처리
                    if (error) return <div>오류 발생: {error}</div>;  // 에러 노출
                    if (!videoInfo) return <div>로딩 중…</div>;

               
               const handleImageClick = () => {
                    console.log('북마크 버튼 활성화');

                    if (isBookmarked) {
                         setBookmarkCount(prev => prev + 1); // 북마크 비활성화
                    } else {
                         setBookmarkCount(prev => prev - 1); // 북마크 활성화
                    }

                    setIsBookmarked(!isBookmarked);
               }; // true => bookMark X / false => bookMark O

               const handlePlayClick = async () =>{
                    try {
                         await fetch(`http://localhost:8080/video/view/${videoId}`, {
                              method : 'POST'
                         });
                    } catch (err) {
                         console.error('조회수 증가 실패' , err);
                    }
                    setHasPlayed(true);
               }
               

          return(
               <>

               <div className={styles.backgroundTexture}>
                    <div className={styles.container}>
                         <div className={styles.video}> {/* video 박스 */}
                              {!hasPlayed
                                   ? (
                                        <button
                                             className={styles.playButton}
                                             onClick={handlePlayClick}
                                        >
                                        ▶ 재생하기
                                        </button>     
                                   )
                              :
                                   (<iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={videoInfo.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                   ></iframe>)
                              }
                         </div> 

                         <div className={styles.videoInfo}>
                              <div className={styles.videoTitle}> 
                                        {/* {videoInfo.snippet.title} */}
                                        {videoInfo.title}
                              </div> {/*videoTitle 영역 끝 */}
                              <div className={styles.channelNameBookMark}>
                                   <div className={styles.channelName}>
                                        {/* {videoInfo.snippet.channelTitle} */}
                                        {videoInfo.channelTitle}
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
                              {/* {videoInfo.snippet.description} */}
                              {videoInfo.description}
                         </div> {/* videoDetail 영역 끝 */}
                         
                         <RecommandedVideoList keyword = {videoInfo.title} />   {/* 현재 영상의 제목을 키워드로 넘김 */}

                    </div> {/* container 영역 끝 */}

               </div>
               </>
          )
     }

export default PlayVideo;

