// 영상 상세페이지 - 관련 콘텐츠 추천 부분
import styles from './RecommandedVideoList.module.css';

function RecommandedVideoList(){
     return (
          <>
               <div className={styles.List}>
                    <div className = {styles.Title}># 관련 콘텐츠 추천</div>
                    <div className={styles.videoList}> 
                         <div className = {styles.videoBox}>     
                              {/* 영상 박스 */}
                         </div>
                         <div className={styles.Info}>
                              <div className={styles.videoTitle}>안읽으면 절대 후회할 인생 소설책 추천 BEST 5📚 </div>
                              <div className={styles.videoinfo}>채인 Chaein ･ 조회수 4.5만회</div>
                              <div className={styles.videoDate}>2025-01-20</div>
                         </div>
                    </div>

                    <div className={styles.videoList}>
                         <div className = {styles.videoBox}>     
                              {/* 영상 박스 */}
                         </div>
                         <div className={styles.Info}>
                              <div className={styles.videoTitle}>안읽으면 절대 후회할 인생 소설책 추천 BEST 5📚 </div>
                              <div className={styles.videoinfo}>채인 Chaein ･ 조회수 4.5만회</div>
                              <div className={styles.videoDate}>2025-01-20</div>
                         </div>
                    </div>

                    <div className={styles.videoList}>
                         <div className = {styles.videoBox}>     
                              {/* 영상 박스 */}
                         </div>
                         <div className={styles.Info}>
                              <div className={styles.videoTitle}>안읽으면 절대 후회할 인생 소설책 추천 BEST 5📚 </div>
                              <div className={styles.videoinfo}>채인 Chaein ･ 조회수 4.5만회</div>
                              <div className={styles.videoDate}>2025-01-20</div>
                         </div>
                    </div>

                    <div className={styles.videoList}>
                         <div className = {styles.videoBox}>     
                              {/* 영상 박스 */}
                         </div>
                         <div className={styles.Info}>
                              <div className={styles.videoTitle}>안읽으면 절대 후회할 인생 소설책 추천 BEST 5📚 </div>
                              <div className={styles.videoinfo}>채인 Chaein ･ 조회수 4.5만회</div>
                              <div className={styles.videoDate}>2025-01-20</div>
                         </div>
                    </div>
               </div>
          </>
     )
}


export default RecommandedVideoList;