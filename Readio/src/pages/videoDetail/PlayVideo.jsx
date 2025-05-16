// 영상 상세페이지 - 영상 재생 / 영상 상세 글 부분
import { useState } from 'react';
import bookMarkO from '../../assets/bookMarkO.png';
import bookMarkX from '../../assets/bookMarkX.png';
import styles from './PlayVideo.module.css';
import RecommandedVideoList from './RecommandedVideoList';


     function PlayVideo() { 

          const [isBookmarked, setIsBookmarked] = useState(true); 
          const [bookmarkCount, setBookmarkCount] = useState(15); // 초기 북마크 수 (설정)

          
               console.log('북마크 버튼 활성화');

               
               const handleImageClick = () => {
                    console.log('북마크 버튼 활성화');

                    if (isBookmarked) {
                         setBookmarkCount(prev => prev + 1); // 북마크 비활성화
                    } else {
                         setBookmarkCount(prev => prev - 1); // 북마크 활성화
                    }


                    setIsBookmarked(!isBookmarked);
               }; // true => bookMark X / false => bookMark O
               

          return(
               <>

               <div className={styles.backgroundTexture}>
                    <div className={styles.container}>
                         <div className={styles.video}> {/* video 박스 */} </div> 
                         <div className={styles.videoInfo}>
                              <div className={styles.videoTitle}> 
                              출퇴근하며 19권 읽은 대학생의 여름 책 추천 📚 지하철에서 독서하는 습관 잡기(●'◡'●)
                              </div> {/*videoTitle 영역 끝 */}
                              <div className={styles.channelNameBookMark}>
                                   <div className={styles.channelName}>
                                        웰밍whelming
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
                              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                                   Doloribus quis accusantium vitae voluptatem! 
                                   Excepturi perspiciatis vitae quisquam. Labore earum, 
                                   sit eius fuga facere soluta illum ab magnam dolore odit ullam!</p>

                         </div> {/* videoDetail 영역 끝 */}
                         
                         <RecommandedVideoList />          

                    </div> {/* container 영역 끝 */}

               </div>
               </>
          )
     }

export default PlayVideo;