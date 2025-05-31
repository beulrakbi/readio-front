import { useState, useEffect } from 'react';
import styles from './Bookmark.module.css';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

function Bookmark() {
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'video'
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]); // 책 북마크 목록
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]); // 영상 북마크 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const getAuthToken = () => {
    return localStorage.getItem('accessToken');
  };

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const videoRes = await fetch('http://localhost:8080/videoBookmark/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!videoRes.ok) {
        const errorText = await videoRes.text();
        throw new Error(`영상 북마크 목록 조회 실패: ${videoRes.status} ${errorText}`);
      }

      const videoData = await videoRes.json();
      setBookmarkedVideos(videoData);

    } catch (err) {
      console.error("북마크 목록을 가져오는 중 오류 발생:", err);
      setError(`북마크 목록을 불러오는 데 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const deleteItem = async (tab, id) => {
    const token = getAuthToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      let url = '';
      if (tab === 'video') {
        url = `http://localhost:8080/videoBookmark/delete/${id}`;
      }

      if (!url) {
        alert("잘못된 탭 또는 ID입니다.");
        return;
      }

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`북마크 삭제 실패: ${res.status} ${errorText}`);
      }

      alert("북마크가 성공적으로 삭제되었습니다.");
      fetchBookmarks(); // 삭제 후 목록 다시 불러오기

    } catch (err) {
      console.error("북마크 삭제 중 오류 발생:", err);
      alert(`북마크 삭제 실패: ${err.message}`);
    }
  };

  // 영상 클릭 시 상세 페이지로 이동하는 핸들러
  const handleVideoClick = (videoId) => {
    // 상세 페이지의 라우트 경로에 맞게 '/video/' 뒤에 videoId를 붙여 이동합니다.
    navigate(`/video/${videoId}`);
  };

  // 로딩 및 에러 UI
  if (loading) return <div className={styles.bookmarkContainer}>로딩 중...</div>;
  if (error) return <div className={styles.bookmarkContainer}>오류 발생: {error}</div>;

  return (
    <div className={styles.bookmarkContainer}>
      {/* 뒤로가기 버튼: navigate(-1)을 사용하면 이전 페이지로 이동합니다. */}
      {/* <button className={styles.backButton} onClick={() => navigate(-1)}>&lt; cOwsun</button> */}
      <button className={styles.backButton}>&lt; cOwsun</button>

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
                <div key={item.id} className={styles.bookmarkItem}>
                  <div className={styles.imgbox}></div> {/* 책 이미지 표시 영역, 백엔드에서 이미지 URL이 온다면 여기에 <img src={item.imageUrl} /> 사용 */}
                  <div className={styles.bookmarkInfo}>
                    <li className={styles.bookmarkTitle}>{item.title}</li>
                    <li className={styles.bookmarkSubtitle}>{item.subtitle}</li>
                  </div>
                  <button
                    className={styles.bookmarkActionButton}
                    onClick={() => deleteItem('book', item.id)}
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
                  {/* 섬네일 클릭 시 상세 페이지로 이동 */}
                  <div
                    className={styles.videoThumbnailWrapper}
                    onClick={() => handleVideoClick(item.videoId)} // 클릭 핸들러 추가
                    style={{ cursor: 'pointer' }} // 시각적 피드백
                  >
                    <img
                      src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                      alt={item.videoTitle}
                      className={styles.videoThumbnail}
                    />
                  </div>
                  {/* 제목/채널명 정보 클릭 시 상세 페이지로 이동 */}
                  <div
                    className={styles.bookmarkInfo}
                    onClick={() => handleVideoClick(item.videoId)} // 클릭 핸들러 추가
                    style={{ cursor: 'pointer' }} // 시각적 피드백
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