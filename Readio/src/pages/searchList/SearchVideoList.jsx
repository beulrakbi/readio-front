import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNewVideos } from '../../apis/VideoAPI';
import search from '../../assets/search.png';
import UserMainCSS from '../user/UserMain.module.css';
import Video from './../../components/video/Video';
import styles from './SearchVideoList.module.css';


function SearchVideoList() {


     const [videoList, setVideoList] = useState([]);
     
     const navigate = useNavigate();
     const location = useLocation();
     const dispatch = useDispatch(); 
     const queryParams = new URLSearchParams(location.search);
     const searchQuery = queryParams.get('query') || '';  

     const [searchInput, setSearchInput] = useState(searchQuery);

     useEffect(() => {
     const fetchVideos = async () => {
          if (searchQuery) {
          try {
               const result = await getNewVideos("기타", searchQuery, dispatch, 0); // 🔥 실시간 API 호출
               if (Array.isArray(result)) {
               setVideoList(result);
               } else {
                    console.warn("검색 결과가 없습니다.");
                    setVideoList([]);
               }
          } catch (error) {
               console.error("검색 중 오류 발생:", error);
          }
          } else {
          setVideoList([]); // 검색어가 없으면 초기화
          }
     };

     fetchVideos(); // useEffect 내부에서 async 함수 호출
     }, [searchQuery, dispatch]);
     
     

     
     const onClickVideoPage = (videoId) => {
          navigate(`/video/${videoId}`);
     }

     const onSearchChangeHandler = (e) => {
          setSearchInput(e.target.value);
     }

     const onEnterkeyHandler = (e) => {
          if (e.key == 'Enter') {
               console.log('Enter key', searchInput);

               navigate(`/search/video?query=${encodeURIComponent(searchInput)}`);
          }
     };

     const onSearchClickHandler = () => {
          navigate(`/search/video?query=${encodeURIComponent(searchInput)}`);
     }
     

     return (
          <>
               <div className={UserMainCSS.mainImgBox}>
                                        <div className={UserMainCSS.mainSearch}>
                                             <div className={UserMainCSS.buttonBox}>
                                                  <input className={UserMainCSS.mainSearchInput} 
                                                            type="text" 
                                                            name="search" 
                                                            value={searchInput}
                                                            onChange={onSearchChangeHandler}
                                                            onKeyDown={onEnterkeyHandler}
                                                            placeholder="검색어를 입력하세요"/>
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
                    <div className={styles.SearchListTitle}>
                         {searchQuery ? ` # ${searchQuery}에 대한 검색 결과` : '전체 영상 리스트'}
                    </div>
                    <hr className={styles.SearchVideoListHr} />
                    <div className={styles.SearchVideoList}>
                         {videoList.length > 0 ? (
                         videoList.map((video) => (
                              <>
                              <div
                                   key={video.etag}
                                   className={styles.video}
                                   onClick={() => onClickVideoPage(video.id.videoId)}
                                   >
                                   <Video video={video} />

                                   <div className={styles.videoInfo}>
                                   <div className={styles.videoTitle}>{video.snippet.title}</div>
                                   <div className={styles.videoDate}>
                                        {video.snippet.publishedAt.slice(0, 10).replace(/-/g, '.')}
                                   </div>
                                   <div className={styles.videoDetail}>{video.snippet.description}</div>
                                   </div>
                              </div>    
                              <hr className={styles.videoListHr} />
                              </>
                         ))
                         ) : (
                         <p>검색 결과가 없습니다.</p>
                         )}
                    </div>
                    </div>
               </>
               );
               }

export default SearchVideoList;
