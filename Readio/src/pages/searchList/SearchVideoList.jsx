import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVideosTest } from '../../apis/VideoAPI';
import search from '../../assets/search.png';
import Video from '../../components/video/Video';
import VideoListCSS from '../../components/video/videoList.module.css';
import UserMainCSS from '../user/UserMain.module.css';
import styles from './SearchVideoList.module.css';


function SearchVideoList() {

     const [videoList, setVideoList] = useState([]);

     useEffect(
          () => {
               // getVideos.then(data => setVideoList(data));
               // fetch(sample).then(data => setVideoList(data.items));
               setVideoList(getVideosTest().items);
               console.log("test", videoList); 
          }
     )
     
     const navigate = useNavigate();
     
     const onClickVideoPage = () => {
          navigate(`/video`);
     }

     const onSearchClickHandler = () => {
          navigate(`/search/video`);
     }
     

     return (
          <>
               <div className={UserMainCSS.mainImgBox}>
                                        <div className={UserMainCSS.mainSearch}>
                                             <div className={UserMainCSS.buttonBox}>
                                                  <input className={UserMainCSS.mainSearchInput} type="text" name="search" placeholder="검색어를 입력하세요"/>
                                                  <button className={UserMainCSS.buttonNone} onClick={onSearchClickHandler}><img src={search}/></button>
                                             </div>
                                             <div className={UserMainCSS.buttonBox}>
                                                  <button className={UserMainCSS.mainKeywordButton} onClick={onSearchClickHandler}>#키워드</button>
                                                  <button className={UserMainCSS.mainKeywordButton} onClick={onSearchClickHandler}>#키워드</button>
                                                  <button className={UserMainCSS.mainKeywordButton} onClick={onSearchClickHandler}>#키워드</button>
                                             </div>
                                        </div>

               </div>

                    
               <div className={styles.container}>

                    <div className={styles.SearchListTitle}># 키워드에 대한 검색 결과</div>
                    <hr />
                    <div className={styles.SearchVideoList}>

                         {/* <div className={styles.videoList} onClick={onClickVideoPage}>
                              {videoList.map(video => (
                                   <div key={video.etag} className = {VideoListCSS.video}></div>
                                   


                              <div className={VideoListCSS.video} key = {video.etag}> </div>
                              <div className={styles.videoInfo}>
                                   <div className={styles.videoTitle}>[이적의 단어들]📜 작가 이적. 책리뷰. 추천도서...</div>
                                   <div className={styles.videoDate}>2023.08.05</div>
                                   <div className={styles.videoDetail}>이적의 단어들 📚 은 싱어송라이터 이적이 시의 형식으로 쓴 에세이입니다. 짧게 단편으로 ...</div>

                                   {videoList.map(info => {return <Video key={video.etag} info={} />})}
                              </div>
                              ))}
                         </div> */}

                         <div className={styles.videoList} onClick={onClickVideoPage}>
                              {videoList.map(video => (
                              <div key={video.etag} className={VideoListCSS.video}>
                                   {/* 영상 미리보기 컴포넌트 */}
                                   <Video video={video} />
                                   
                                   {/* 영상 정보 */}
                                   <div className={styles.videoInfo}>
                                   <div className={styles.videoTitle}>{video.snippet.title}</div>
                                   <div className={styles.videoDate}>
                                        {video.snippet.publishedAt.slice(0, 10).replace(/-/g, '.')}
                                   </div>
                                   <div className={styles.videoDetail}>{video.snippet.description}</div>
                                   </div>
                              </div>
                              ))}
                         </div>

                         {/* <hr /> */}

                         {/* <div className={styles.videoList} onClick={onClickVideoPage}>
                              <div className={styles.video}></div>
                              <div className={styles.videoInfo}>
                                   <div className={styles.videoTitle}>[이적의 단어들]📜 작가 이적. 책리뷰. 추천도서...</div>
                                   <div className={styles.videoDate}>2023.08.05</div>
                                   <div className={styles.videoDetail}>이적의 단어들 📚 은 싱어송라이터 이적이 시의 형식으로 쓴 에세이입니다. 짧게 단편으로 ...</div>
                              </div>
                         </div>
                         <hr />

                         <div className={styles.videoList} onClick={onClickVideoPage}>
                              <div className={styles.video}></div>
                              <div className={styles.videoInfo}>
                                   <div className={styles.videoTitle}>[이적의 단어들]📜 작가 이적. 책리뷰. 추천도서...</div>
                                   <div className={styles.videoDate}>2023.08.05</div>
                                   <div className={styles.videoDetail}>이적의 단어들 📚 은 싱어송라이터 이적이 시의 형식으로 쓴 에세이입니다. 짧게 단편으로 ...</div>
                              </div>
                         </div>
                         <hr />

                         <div className={styles.videoList} onClick={onClickVideoPage}>
                              <div className={styles.video}></div>
                              <div className={styles.videoInfo}>
                                   <div className={styles.videoTitle}>[이적의 단어들]📜 작가 이적. 책리뷰. 추천도서...</div>
                                   <div className={styles.videoDate}>2023.08.05</div>
                                   <div className={styles.videoDetail}>이적의 단어들 📚 은 싱어송라이터 이적이 시의 형식으로 쓴 에세이입니다. 짧게 단편으로 ...</div>
                              </div>
                         </div> */}

                    </div>
                    <hr />
                    
               </div>
          </>
     )
}

export default SearchVideoList;