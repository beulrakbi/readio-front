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

  // getAuthToken 함수는 localStorage에서 토큰을 가져옵니다.
  const getAuthToken = () => {
    return localStorage.getItem('accessToken');
  };

  // getAuthHeader 함수는 sessionStorage에서 토큰을 가져와 헤더 객체를 반환합니다.
  // 이 함수는 컴포넌트 스코프의 최상단에 선언되어 모든 요청에서 재사용될 수 있어야 합니다.
  const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
    console.log("필터링 토큰 :", token);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken(); // localStorage에서 토큰 가져오기 (만약 getAuthHeader가 sessionStorage 사용한다면 이 부분과 충돌 확인)

    // getAuthHeader는 sessionStorage에서 가져오므로, getAuthToken과의 사용처를 명확히 해야 합니다.
    // 여기서는 getAuthHeader에서 토큰을 직접 가져오므로, 위 getAuthToken 호출은 불필요할 수 있습니다.
    // 일관성을 위해 모든 인증 관련 토큰은 getAuthHeader()를 통해 가져오는 것을 권장합니다.
    const authHeader = getAuthHeader(); // 인증 헤더 미리 생성

    // 토큰이 없을 경우 바로 에러 처리
    if (!authHeader['Authorization']) { // 'Authorization' 키의 존재 여부로 토큰 유무 확인
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      // 1. 영상 북마크 목록 가져오기 (기존 로직)
      const videoRes = await fetch('http://localhost:8080/videoBookmark/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          ...authHeader // getAuthHeader에서 생성된 헤더 객체 사용
        },
      });

      if (!videoRes.ok) {
        const errorText = await videoRes.text();
        throw new Error(`영상 북마크 목록 조회 실패: ${videoRes.status} ${errorText}`);
      }
      const videoData = await videoRes.json();
      setBookmarkedVideos(videoData);

      // 2. 책 북마크 목록 가져오기 (새로운 로직 추가)
      // userId 파라미터가 필요한지 백엔드 API 명세에 따라 확인하세요.
      // 만약 백엔드 Controller가 @AuthenticationPrincipal UserDetails를 사용한다면 userId 파라미터는 필요 없음.
      const bookRes = await fetch(`http://localhost:8080/bookBookmark/list?userId=${localStorage.getItem('userId')}`, {
      // 또는 userId 없이 호출: const bookRes = await fetch('http://localhost:8080/bookBookmark/list', {
        headers: {
          'Content-Type': 'application/json', // 책 북마크에도 Content-Type 추가 (필요시)
          Accept: '*/*', // 책 북마크에도 Accept 추가 (필요시)
          ...authHeader // getAuthHeader에서 생성된 헤더 객체 사용
        }
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
  }, []);

  const deleteItem = async (tab, id) => {
    const authHeader = getAuthHeader(); // 삭제 요청 시에도 인증 헤더 사용

    if (!authHeader['Authorization']) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      let url = '';
      if (tab === 'video') {
        url = `http://localhost:8080/videoBookmark/delete/${id}`;
      } else if (tab === 'book') { // 책 삭제 로직 추가
        url = `http://localhost:8080/bookBookmark/delete/${id}`;
      }

      if (!url) {
        alert("잘못된 탭 또는 ID입니다.");
        return;
      }

      const res = await fetch(url, {
        method: 'DELETE',
        headers: authHeader // 인증 헤더 적용
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
    navigate(`/video/${videoId}`); // 상세 페이지 라우트 경로에 맞게 수정
  };

  // 책 클릭 시 상세 페이지로 이동하는 핸들러 (새로 추가)
  const handleBookClick = (bookIsbn) => {
    navigate(`/bookPage/${bookIsbn}`);
  };


  // 로딩 및 에러 UI
  if (loading) return <div className={styles.bookmarkContainer}>로딩 중...</div>;
  if (error) return <div className={styles.bookmarkContainer}>오류 발생: {error}</div>;

  return (
    <div className={styles.bookmarkContainer}>
      {/* 뒤로가기 버튼: navigate(-1)을 사용하면 이전 페이지로 이동합니다. */}
      {/* <button className={styles.backButton} onClick={() => navigate(-1)}>< cOwsun</button> */}
      <button className={styles.backButton}>< cOwsun/></button>

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
                <div key={item.bookmarkId} className={styles.bookmarkItem}> {/* key를 bookmarkId로 변경 */}
                  {/* 책 이미지 클릭 시 상세 페이지로 이동 */}
                  <div
                    className={styles.imgbox} // 기존 imgbox 스타일 사용
                    onClick={() => handleBookClick(item.bookIsbn)} // 클릭 핸들러 추가
                    style={{ cursor: 'pointer' }} // 시각적 피드백
                  >
                    {/* 백엔드에서 받은 bookCover URL 사용 */}
                    {item.bookCover && <img src={item.bookCover} alt={item.bookTitle} className={styles.bookCoverImage} />}
                    {/* 이미지 없을 경우 대체 텍스트 또는 아이콘 */}
                    {!item.bookCover && <div className={styles.noBookCover}>No Image</div>}
                  </div>
                  {/* 책 제목/저자 정보 클릭 시 상세 페이지로 이동 */}
                  <div
                    className={styles.bookmarkInfo}
                    onClick={() => handleBookClick(item.bookIsbn)} // 클릭 핸들러 추가
                    style={{ cursor: 'pointer' }} // 시각적 피드백
                  >
                    <li className={styles.bookmarkTitle}>{item.bookTitle}</li>     {/* bookTitle 사용 */}
                    <li className={styles.bookmarkSubtitle}>{item.bookAuthor}</li> {/* bookAuthor 사용 */}
                  </div>
                  <button
                    className={styles.bookmarkActionButton}
                    onClick={() => deleteItem('book', item.bookmarkId)} // 삭제 시 bookmarkId 사용
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
                      // 주의: 'https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg' 부분의 '0'을 확인해주세요.
                      // 실제 YouTube 썸네일 URL 형식은 다를 수 있습니다. 일반적으로 'https://img.youtube.com/vi/{videoId}/mqdefault.jpg' 입니다.
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