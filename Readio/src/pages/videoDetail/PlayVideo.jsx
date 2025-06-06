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
        return sessionStorage.getItem('accessToken');
    };

    useEffect(() => {
        const fetchVideoAndBookmarkStatus = async () => {
            try {
                // 1. 비디오 기본 정보 가져오기
                const videoRes = await fetch(`http://localhost:8080/video/id/${videoId}`);
                if (!videoRes.ok) throw new Error(`Status ${videoRes.status}`);
                const videoResDto = await videoRes.json();
                setVideoInfo(videoResDto.data);

                // 2. 총 북마크 개수 가져오기
                const publicCountRes = await fetch(`http://localhost:8080/videoBookmark/publicCount/${videoId}`);
                if (publicCountRes.ok) {
                    const publicCount = await publicCountRes.json();
                    setBookmarkCount(publicCount);
                } else {
                    setBookmarkCount(0);
                }

                // 3. 토큰 있을 경우 사용자별 북마크 상태 가져오기
                const token = getAuthToken();
                if (token) {
                    const bookmarkStatusRes = await fetch(`http://localhost:8080/videoBookmark/status/${videoId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!bookmarkStatusRes.ok) {
                        setIsBookmarked(false);
                        setUserBookmarkId(null);
                    } else {
                        const bookmarkData = await bookmarkStatusRes.json();
                        setIsBookmarked(bookmarkData.bookmarked);
                        setUserBookmarkId(bookmarkData.bookmarkId);
                    }
                } else {
                    setIsBookmarked(false);
                    setUserBookmarkId(null);
                }

            } catch (err) {
                setError(err.message);
            }
        };
        fetchVideoAndBookmarkStatus();
    }, [videoId]);

    // 에러 UI 처리
    if (error) return <div>오류 발생: {error}</div>;
    if (!videoInfo) return <div>로딩 중…</div>;


    const handleImageClick = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            if (isBookmarked) {
                // 북마크 삭제
                if (!userBookmarkId) {
                    alert("북마크 ID를 찾을 수 없어 삭제할 수 없습니다. (재로그인 필요)");
                    return;
                }
                const res = await fetch(`http://localhost:8080/videoBookmark/delete/${userBookmarkId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`북마크 삭제 실패: ${res.status}`);

                alert("즐겨찾기가 삭제되었습니다.");
                setIsBookmarked(false);
                setBookmarkCount(prev => Math.max(prev - 1, 0));
                setUserBookmarkId(null);

            } else {
                // 북마크 생성
                const res = await fetch('http://localhost:8080/videoBookmark/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ videoId })
                });
                if (!res.ok) throw new Error(`북마크 등록 실패: ${res.status}`);

                // 서버가 bookmarkId를 안 주므로, 생성 후 상태 다시 조회
                const statusRes = await fetch(`http://localhost:8080/videoBookmark/status/${videoId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!statusRes.ok) throw new Error(`북마크 상태 조회 실패: ${statusRes.status}`);

                const statusData = await statusRes.json();

                setIsBookmarked(statusData.bookmarked);
                setUserBookmarkId(statusData.bookmarkId);
                setBookmarkCount(prev => prev + 1);

                alert("즐겨찾기가 성공적으로 등록되었습니다.");
            }
        } catch (err) {
            setError(err.message);
            alert(`오류 발생: ${err.message}`);
        }
    };


    const handlePlayClick = async () => {
        try {
            // “/video/id/{videoId}”로 맞춰서 호출
            const res = await fetch(`http://localhost:8080/video/id/${videoId}`, {
                method: 'POST'
            });
            if (!res.ok) {
                console.error('조회수 증가 실패, status:', res.status);
            }
        } catch (err) {
            console.error('조회수 증가 중 예외', err);
        }
        setHasPlayed(true);
    };


    return (
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
                                    src={isBookmarked ? bookMarkO : bookMarkX}
                                    alt="BookMark"
                                    onClick={handleImageClick}
                                    className={styles.bookmark}
                                />
                            </div>
                        </div> {/* channelNameBookMark */}
                    </div> {/* videoInfo 영역 끝 */}
                    <div className={styles.videoDetail}>
                        {/* {videoInfo.snippet.description} */}

                        <div className={styles.videoStats}>
                            <div className={styles.videoViewCount}>조회수: {videoInfo.viewCount.toLocaleString()}회</div>
                            <div className={styles.videoUploadDate}> {new Date(videoInfo.uploadDate).toLocaleDateString()}</div>
                        </div>

                        {videoInfo.description}
                    </div> {/* videoDetail 영역 끝 */}

                    <RecommandedVideoList keyword={videoInfo.title} />   {/* 현재 영상의 제목을 키워드로 넘김 */}

                </div> {/* container 영역 끝 */}

            </div>
        </>
    )
}

export default PlayVideo;
