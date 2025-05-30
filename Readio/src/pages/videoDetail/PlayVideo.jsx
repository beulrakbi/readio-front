import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bookMarkO from '../../assets/bookMarkO.png'; // 북마크 된 상태 이미지 (꽉 찬)
import bookMarkX from '../../assets/bookMarkX.png'; // 북마크 안 된 상태 이미지 (빈)
import styles from './PlayVideo.module.css';
import RecommandedVideoList from './RecommandedVideoList';

function PlayVideo() { 
    const { videoId } = useParams();

    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false); // 초기 상태: 북마크 안 됨
    const [bookmarkCount, setBookmarkCount] = useState(0); // 초기 상태: 0
    const [videoInfo, setVideoInfo] = useState(null); 

    const [hasPlayed, setHasPlayed] = useState(false);
    const [userBookmarkId, setUserBookmarkId] = useState(null); 
    
    const getAuthToken = () => {
        return localStorage.getItem('accessToken'); 
    };
    
    console.log('북마크 버튼 활성화');

    useEffect(() => {
        const fetchVideoAndBookmarkStatus = async () => {
            try {
                // 1. 비디오 기본 정보 가져오기 (변동 없음)
                const videoRes = await fetch(`http://localhost:8080/video/id/${videoId}`); 
                if (!videoRes.ok) throw new Error(`Status ${videoRes.status}`);         
                const videoResDto = await videoRes.json();
                setVideoInfo(videoResDto.data);

                // 2. 로그인 여부와 상관없이 총 북마크 개수 가져오기 (새로운 publicCount API 사용)
                const publicCountRes = await fetch(`http://localhost:8080/videoBookmark/publicCount/${videoId}`);
                if (publicCountRes.ok) {
                    const publicCount = await publicCountRes.json();
                    setBookmarkCount(publicCount);
                    console.log("useEffect: 총 북마크 개수 설정됨 (publicCount API):", publicCount);
                } else {
                    console.error("총 북마크 개수 불러오기 실패:", publicCountRes.status, publicCountRes.statusText);
                    setBookmarkCount(0);
                }

                // 3. 토큰이 있을 경우에만 사용자별 북마크 상태 가져오기 (status API는 이제 인증 필요)
                const token = getAuthToken();
                console.log("useEffect: 현재 토큰:", token);

                if (token) {
                    const bookmarkStatusRes = await fetch(`http://localhost:8080/videoBookmark/status/${videoId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!bookmarkStatusRes.ok) {
                        console.error("사용자 북마크 상태 불러오기 실패:", bookmarkStatusRes.status, await bookmarkStatusRes.text());
                        setIsBookmarked(false);
                        console.log("useEffect: isBookmarked 설정됨 (status API 실패): false");
                    } else {
                        const bookmarkData = await bookmarkStatusRes.json();
                        // !!! 이 부분 변경: bookmarkData.isBookmarked -> bookmarkData.bookmarked
                        setIsBookmarked(bookmarkData.bookmarked); // <-- 여기를 수정했습니다!
                        console.log("useEffect: isBookmarked 설정됨 (status API 응답):", bookmarkData.bookmarked); // 로그도 수정
                        setUserBookmarkId(bookmarkData.bookmarkId);
                        console.log("useEffect: 받은 북마크 상태 데이터:", bookmarkData);
                    }
                } else {
                    setIsBookmarked(false);
                    console.log("useEffect: isBookmarked 설정됨 (토큰 없음): false");
                    setUserBookmarkId(null);
                }

            } catch (err) {
                console.error("초기 데이터 로드 중 오류 발생:", err);
                setError(err.message);
            }
        };
        fetchVideoAndBookmarkStatus();
    }, [videoId]);

    // 에러 UI 처리
    if (error) return <div>오류 발생: {error}</div>;
    if (!videoInfo) return <div>로딩 중…</div>;

    const handleImageClick = async () => {
        console.log('북마크 버튼 활성화');
        const token = getAuthToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            let updatedBookmarkCount;

            if (isBookmarked) { // 현재 북마크 되어있으면 -> 삭제 요청
                if (!userBookmarkId) {
                    alert("북마크 ID를 찾을 수 없어 삭제할 수 없습니다. (재로그인 필요)");
                    return;
                }
                const res = await fetch(`http://localhost:8080/videoBookmark/delete/${userBookmarkId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error(`북마크 삭제 실패: ${res.status}`);
                
                updatedBookmarkCount = await res.json();
                alert("즐겨찾기가 삭제되었습니다.");
                setIsBookmarked(false);
                console.log("handleImageClick: isBookmarked 설정됨 (삭제 성공): false");
                setUserBookmarkId(null);
            } else { // 현재 북마크 안 되어있으면 -> 등록 요청
                const res = await fetch('http://localhost:8080/videoBookmark/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ videoId: videoId })
                });
                if (!res.ok) throw new Error(`북마크 등록 실패: ${res.status}`);
                
                updatedBookmarkCount = await res.json();
                alert("즐겨찾기가 성공적으로 등록되었습니다.");
                setIsBookmarked(true);
                console.log("handleImageClick: isBookmarked 설정됨 (등록 성공): true");
            }
            setBookmarkCount(updatedBookmarkCount);
        } catch (err) {
            console.error('북마크 처리 실패', err);
            setError(err.message);
            alert(`오류 발생: ${err.message}`);
        }
    };

    const handlePlayClick = async () => {
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
                    <div className={styles.video}>
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
                                src={`http://www.youtube.com/embed/${videoId}?autoplay=1`}
                                title={videoInfo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>)
                        }
                    </div> 

                    <div className={styles.videoInfo}>
                        <div className={styles.videoTitle}> 
                            {videoInfo.title}
                        </div>
                        <div className={styles.channelNameBookMark}>
                            <div className={styles.channelName}>
                                {videoInfo.channelTitle}
                            </div>
                            <div className={styles.BookMark}>
                                북마크 {bookmarkCount}
                                <img 
                                    src={isBookmarked ? bookMarkO : bookMarkX} // isBookmarked 상태에 따라 이미지 소스 결정
                                    alt="BookMark"
                                    onClick={handleImageClick}
                                    className={styles.bookmark}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.videoDetail}> 
                        {videoInfo.description}
                    </div>
                    
                    <RecommandedVideoList keyword = {videoInfo.title} />

                </div>

            </div>
        </>
    );
}

export default PlayVideo;

//커밋용 주석