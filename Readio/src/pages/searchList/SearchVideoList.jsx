import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchNewVideos, searchVideosByKeyword } from '../../apis/VideoAPI';
import search from '../../assets/search.png';
import VIdeoInDB from "../../components/video/VIdeoInDB.jsx";
import UserMainCSS from '../user/UserMain.module.css';
import Video from './../../components/video/Video';
import styles from './SearchVideoList.module.css';

function SearchVideoList() {

    const [videoList, setVideoList] = useState([]);
    const [videoInDBList, setVideoInDBList] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    const page = parseInt(queryParams.get('page'), 10) || 1;
    const size = 10;

    const [searchInput, setSearchInput] = useState(searchQuery);

    useEffect(() => {
        const fetchVideos = async () => {
            if (searchQuery) {
                try {
                    const searchVideosInDB = await searchVideosByKeyword(searchQuery, dispatch);
                    const videosInDB = searchVideosInDB?.data.videoDTOList;
                    let result = null;  

                    if (Array.isArray(videosInDB)) {
                        setVideoInDBList(
                            videosInDB.filter((video, index, self) => index === self.findIndex(v => v.videoId === video.videoId))
                        );
                        result = await searchNewVideos(searchQuery, dispatch, videosInDB.length);
                    } else {
                        console.warn("검색 결과가 없습니다.");
                        setVideoInDBList([]);
                    }

                    if (Array.isArray(result)) {
                        setVideoList(
                            result.filter((video, index, self) => index === self.findIndex(v => v.videoId === video.videoId))
                        );
                    } else {
                        console.warn("검색 결과가 없습니다.");
                        setVideoList([]);
                    }
                } catch (error) {
                    console.error("검색 중 오류 발생:", error);
                }
            } else {
                setVideoList([]);
                setVideoInDBList([]);
            }
        };

        fetchVideos();
    }, [searchQuery, dispatch]);

    // 페이지네이션 계산
    const combined = [...videoInDBList, ...videoList];
    const totalCount = combined.length;
    const totalPages = Math.ceil(totalCount / size);

    const start = (page - 1) * size;
    const end = start + size;
    const currentPageItems = combined.slice(start, end);

    // 페이지 버튼 렌더링
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        return (
            <div className={styles.paginationContainer}>
                {Array.from({ length: totalPages }, (_, i) => {
                    const num = i + 1;
                    return (
                        <button
                            key={num}
                            className={`${styles.pageButton} ${page === num ? styles.activePage : ''}`}
                            onClick={() =>
                                navigate(`/search/video?query=${encodeURIComponent(searchQuery)}&page=${num}`)
                            }
                        >
                            {num}
                        </button>
                    );
                })}
            </div>
        );
    };

    const onClickVideoPage = (videoId) => {
        navigate(`/video/${videoId}`);
    }

    const onSearchChangeHandler = (e) => {
        setSearchInput(e.target.value);
    }

    const onEnterkeyHandler = (e) => {
        if (e.key == 'Enter') {
            navigate(`/search/video?query=${encodeURIComponent(searchInput)}`);
        }
    };

    const onSearchClickHandler = () => {
        navigate(`/search/video?query=${encodeURIComponent(searchInput)}`);
    }

    return (<>
        <div className={UserMainCSS.mainImgBox}>
            <div className={UserMainCSS.mainSearch}>
                <div className={UserMainCSS.buttonBox}>
                    <input className={UserMainCSS.mainSearchInput}
                           type="text"
                           value={searchInput}
                           onChange={onSearchChangeHandler}
                           onKeyDown={onEnterkeyHandler}
                           placeholder="검색어를 입력하세요" />
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
                {searchQuery ? `# ${searchQuery}에 대한 검색 결과` : '전체 영상 리스트'}
            </div>
            <hr className={styles.SearchVideoListHr}/>
            <div className={styles.SearchVideoList}>
                {currentPageItems.length > 0 ? (  
                    currentPageItems.map(item => {
                        const isDB = !!item.videoId;  
                        const vid = isDB ? item.videoId : item.id.videoId;
                        return (
                            <Fragment key={vid}>  
                                <div
                                    className={styles.video}
                                    onClick={() => onClickVideoPage(vid)}
                                >
                                    {isDB
                                        ? <VIdeoInDB videoInDB={item} />
                                        : <Video video={item} />
                                    }
                                    <div className={styles.videoInfo}>
                                        <div className={styles.videoTitle}>
                                            {isDB ? item.title : item.snippet.title}
                                        </div>
                                        {!isDB && (
                                            <div className={styles.videoDate}>
                                                {item.snippet.publishedAt.slice(0, 10).replace(/-/g, '.')}  
                                            </div>
                                        )}
                                        <div className={styles.videoDetail}>
                                            {isDB ? item.description : item.snippet.description}
                                        </div>
                                    </div>
                                </div>
                                <hr className={styles.videoListHr}/>
                            </Fragment>
                        );
                    })
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>

            {renderPagination()}
        </div>
    </>);
}

export default SearchVideoList;
