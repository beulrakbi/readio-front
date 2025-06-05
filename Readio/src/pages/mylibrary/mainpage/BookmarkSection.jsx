import React, { useState, useEffect, useCallback } from 'react';
import styles from './MyLibrary.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const BookmarkSection = () => {
    const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
    const [bookmarkedVideos, setBookmarkedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const currentUserId = sessionStorage.getItem("userId");
    const targetUserId = paramUserId || currentUserId;

    const getAuthHeader = () => {
        const token = sessionStorage.getItem('accessToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const fetchBookmarks = useCallback(async () => {
        setLoading(true);
        setError(null);
        const authHeader = getAuthHeader();

        if (!targetUserId || !authHeader['Authorization']) {
            setError("로그인이 필요하거나 대상 사용자 ID를 찾을 수 없습니다.");
            setLoading(false);
            return;
        }

        try {
            // 영상 북마크 가져오기
            const videoRes = await fetch('http://localhost:8080/videoBookmark/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    ...authHeader
                },
            });

            if (!videoRes.ok) {
                const errorText = await videoRes.text();
                throw new Error(`영상 북마크 목록 조회 실패: ${videoRes.status} ${errorText}`);
            }
            let videoData = await videoRes.json();
            // **영상 북마크 랜덤 정렬 로직 추가**
            if (videoData && videoData.length > 0) {
                 videoData.sort(() => Math.random() - 0.5); // 배열을 무작위로 섞습니다.
            }
            setBookmarkedVideos(videoData);

            // 도서 북마크 가져오기
            const bookRes = await fetch(`http://localhost:8080/bookBookmark/list?userId=${targetUserId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    ...authHeader
                },
            });
            if (!bookRes.ok) {
                const errorText = await bookRes.text();
                throw new Error(`책 북마크 목록 조회 실패: ${bookRes.status} ${errorText}`);
            }
            let bookData = await bookRes.json();
            // **도서 북마크 랜덤 정렬 로직 추가**
            if (bookData && bookData.length > 0) {
                bookData.sort(() => Math.random() - 0.5); // 배열을 무작위로 섞습니다.
            }
            setBookmarkedBooks(bookData);

        } catch (err) {
            console.error("북마크 목록을 가져오는 중 오류 발생:", err);
            setError(`북마크 목록을 불러오는 데 실패했습니다: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [targetUserId]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`);
    };

    const handleBookClick = (bookIsbn) => {
        navigate(`/bookPage/${bookIsbn}`);
    };

    if (loading) return <div className={styles.bookmarkContainer}>로딩 중...</div>;
    if (error) return <div className={styles.bookmarkContainer}>오류 발생: {error}</div>;

    return (
        <>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>영상</h2>
                    <span className={styles.sectionAction} onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'video' } })}>전체보기</span>
                </div>

                {bookmarkedVideos.length > 0 ? (
                    <div className={styles.videoBookmarkList}>
                        {/* slice(0, 5)는 상위 5개만 보여줍니다. */}
                        {bookmarkedVideos.slice(0, 4).map((item) => (
                            <div key={item.bookmarkId}
                                 className={styles.videoBookmarkItem}
                                 onClick={() => handleVideoClick(item.videoId)}
                                 style={{ cursor: 'pointer' }}>
                                <div className={styles.videoThumbnailWrapper}>
                                    <img
                                        src={`http://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                                        alt={item.videoTitle}
                                        className={styles.videoThumbnail}
                                    />
                                </div>
                                <div className={styles.bookmarkInfo}>
                                    <li className={styles.bookmarkTitle}>{item.videoTitle}</li>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noContent}>북마크된 영상이 없습니다.</div>
                )}
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>도서</h2>
                    <span className={styles.sectionAction} onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'book' } })}>전체보기</span>
                </div>

                {bookmarkedBooks.length > 0 ? (
                    <div className={styles.bookmarkList}>
                        {/* slice(0, 5)는 상위 5개만 보여줍니다. */}
                        {bookmarkedBooks.slice(0, 6).map((item) => (
                            <div key={item.bookmarkId}
                                 className={styles.bookmarkItem}
                                 onClick={() => handleBookClick(item.bookIsbn)}
                                 style={{ cursor: 'pointer' }}>
                                <div className={styles.imgbox}>
                                    {item.bookCover && <img src={item.bookCover} alt={item.bookTitle} className={styles.bookCoverImage} />}
                                    {!item.bookCover && <div className={styles.noBookCover}>No Image</div>}
                                </div>
                                <div className={styles.bookmarkInfo}>
                                    <li className={styles.bookmarkTitle}>{item.bookTitle}</li>
                                    <li className={styles.bookmarkSubtitle}>{item.bookAuthor}</li>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noContent}>북마크된 책이 없습니다.</div>
                )}
            </div>
        </>
    );
};

export default BookmarkSection;