import { useState, useEffect } from 'react';
import styles from './Bookmark.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import PostListCSS from "../mylibrary/mypost/PostList.module.css"; // useNavigate, useLocation 임포트

function Bookmark() {
  const location = useLocation(); // ✨ useLocation 훅 추가
  // ✨ 전달받은 state에서 activeTab 값을 읽어오거나, 없으면 기본값 'book' 사용
  const initialActiveTab = location.state?.activeTab || 'book';
  const [activeTab, setActiveTab] = useState(initialActiveTab); // 'book' or 'video'
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]); // 책 북마크 목록
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]); // 영상 북마크 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate(); // useNavigate 훅 초기화

  // ... (getAuthToken, getAuthHeader 함수는 동일) ...

  const getAuthToken = () => {
    return localStorage.getItem('accessToken');
  };

  const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    console.log("필터링 토큰 :",  token)
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    const authHeader = getAuthHeader();

    if (!authHeader['Authorization']) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
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
      const videoData = await videoRes.json();
      setBookmarkedVideos(videoData);

      const bookRes = await fetch(`http://localhost:8080/bookBookmark/list?userId=${localStorage.getItem('userId')}`, {
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
      const bookData = await bookRes.json();
      setBookmarkedBooks(bookData);

    } catch (err) {
      console.error("북마크 목록을 가져오는 중 오류 발생:", err);
      setError(`북마크 목록을 불러오는 데 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [localStorage.getItem('userId')]);

  // ... (deleteItem, handleVideoClick, handleBookClick 함수는 동일) ...

  const deleteItem = async (tab, id) => {
    const authHeader = getAuthHeader();

    if (!authHeader['Authorization']) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      let url = '';
      if (tab === 'video') {
        url = `http://localhost:8080/videoBookmark/delete/${id}`;
      } else if (tab === 'book') {
        url = `http://localhost:8080/bookBookmark/delete/${id}`;
      }

      if (!url) {
        alert("잘못된 탭 또는 ID입니다.");
        return;
      }

      const res = await fetch(url, {
        method: 'DELETE',
        headers: authHeader
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`북마크 삭제 실패: ${res.status} ${errorText}`);
      }

      alert("북마크가 성공적으로 삭제되었습니다.");
      fetchBookmarks();
    } catch (err) {
      console.error("북마크 삭제 중 오류 발생:", err);
      alert(`북마크 삭제 실패: ${err.message}`);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleBookClick = (bookIsbn) => {
    navigate(`/bookPage/${bookIsbn}`);
  };

  if (loading) return <div className={styles.bookmarkContainer}>로딩 중...</div>;
  if (error) return <div className={styles.bookmarkContainer}>오류 발생: {error}</div>;

  return (
    <div className={styles.bookmarkContainer}>
      <button className={PostListCSS.followBackBt} onClick={() => navigate('/mylibrary')}>&lt; 뒤로가기</button>
      <div className={styles.tabContainer}>
        <div className={styles.tabButtonWrapper}>
          <button
            className={`${styles.tabButton} ${activeTab === 'book' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('book')}
          >
            책 {bookmarkedBooks.length}
          </button>
        </div>
        <div className={styles.tabButtonWrapper}>
          <button
            className={`${styles.tabButton} ${activeTab === 'video' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('video')}
          >
            영상 {bookmarkedVideos.length}
          </button>
        </div>
      </div>

      <div className={styles.scrollableContent}>
        {activeTab === 'book'
          ? bookmarkedBooks.length > 0 ? (
              bookmarkedBooks.map((item) => (
                <div key={item.bookmarkId} className={styles.bookmarkItem}>
                  <div
                    className={styles.imgbox}
                    onClick={() => handleBookClick(item.bookIsbn)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.bookCover && <img src={item.bookCover} alt={item.bookTitle} className={styles.bookCoverImage} />}
                    {!item.bookCover && <div className={styles.noBookCover}>No Image</div>}
                  </div>
                  <div
                    className={styles.bookmarkInfo}
                    onClick={() => handleBookClick(item.bookIsbn)}
                    style={{ cursor: 'pointer' }}
                  >
                    <li className={styles.bookmarkTitle}>{item.bookTitle}</li>
                    <li className={styles.bookmarkSubtitle}>{item.bookAuthor}</li>
                  </div>
                  <button
                    className={styles.bookmarkActionButton}
                    onClick={() => deleteItem('book', item.bookmarkId)}
                  >
                    삭제
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noContent}>북마크된 책이 없습니다.</div>
            )
          : null}

        {activeTab === 'video'
          ? bookmarkedVideos.length > 0 ? (
              bookmarkedVideos.map((item) => (
                <div key={item.bookmarkId} className={styles.bookmarkItem}>
                  <div
                    className={styles.videoThumbnailWrapper}
                    onClick={() => handleVideoClick(item.videoId)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* YouTube 썸네일 URL의 '0'을 확인하세요. 보통 '1' 또는 'default' 입니다. */}
                    <img
                      src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                      alt={item.videoTitle}
                      className={styles.videoThumbnail}
                    />
                  </div>
                  <div
                    className={styles.bookmarkInfo}
                    onClick={() => handleVideoClick(item.videoId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <li className={styles.bookmarkTitle}>{item.videoTitle}</li>
                    <li className={styles.bookmarkSubtitle}>{item.channelTitle}</li>
                  </div>
                  <button
                    className={styles.bookmarkActionButton}
                    onClick={() => deleteItem('video', item.bookmarkId)}
                  >
                    삭제
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noContent}>북마크된 영상이 없습니다.</div>
            )
          : null}
      </div>
    </div>
  );
}

export default Bookmark;