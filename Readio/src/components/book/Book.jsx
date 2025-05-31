import { useEffect, useState } from "react";
import bookMarkO from '../../assets/bookMarkO.png'; // 북마크 된 상태 이미지 (꽉 찬)
import bookMarkX from '../../assets/bookMarkX.png'; // 북마크 안 된 상태 이미지 (빈)
import BookCSS from "./Book.module.css";
import VideosInBook from "./VideosInBook";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { callBookAPI } from "../../apis/BookAPICalls.js"; // BookAPICalls.js의 경로 확인

function Book() {
    const [book, setBook] = useState(null); // 초기값을 null로 설정하여 로딩 상태 처리
    const [bookCover, setBookCover] = useState('');
    const param = useParams(); // URL 파라미터에서 bookIsbn 가져오기
    const dispatch = useDispatch();

    // 책 북마크 관련 상태
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false); // 초기 상태: 북마크 안 됨
    const [bookBookmarkCount, setBookBookmarkCount] = useState(0); // 초기 상태: 0
    const [userBookBookmarkId, setUserBookBookmarkId] = useState(null); // 사용자의 해당 책 북마크 ID

    // 로딩 상태 변수
    const [loading, setLoading] = useState(true); // 초기값은 true (데이터 로딩 시작)


    // 로컬 스토리지에서 인증 토큰을 가져오는 함수
    const getAuthToken = () => {
        return localStorage.getItem('accessToken');
    };

    // 책 정보 및 북마크 상태/개수를 가져오는 비동기 함수
    useEffect(() => {
        const fetchBookInfoAndBookmarkStatus = async () => {
            setBook(null); // 새로운 책 정보 로딩 시작 (이전 책 정보 지우기)
            setError(null); // 에러 상태 초기화
            setLoading(true); // 로딩 시작
            const token = getAuthToken();

            try {
                console.log("--- [Book.jsx] 책 정보 및 북마크 상태 로딩 시작 ---");
                console.log("[Book.jsx] 현재 URL 파라미터 (bookIsbn):", param.bookIsbn);
                console.log("[Book.jsx] 현재 토큰:", token ? token.substring(0, 10) + '...' : '없음'); // 토큰 일부만 표시

                // 1. 책 기본 정보 가져오기 (Redux Thunk 사용)
                const bookInfoResult = await dispatch(callBookAPI({ bookIsbn: param.bookIsbn }));
                console.log("[Book.jsx] callBookAPI dispatch 결과:", bookInfoResult);

                const bookDataFromApi = bookInfoResult; 

                if (!bookDataFromApi || !bookDataFromApi.bookIsbn) {
                    throw new Error("책 기본 정보를 불러오는 데 실패했습니다. (데이터 부족 또는 잘못된 형식)");
                }
                
                setBook(bookDataFromApi);

                // bookCover URL 처리 (알라딘 API 응답 형식에 따라 조정)
                if (bookDataFromApi.bookCover) {
                    setBookCover(bookDataFromApi.bookCover.replace("coversum", "cover500"));
                } else {
                    setBookCover('');
                }
                console.log("[Book.jsx] 책 기본 정보 로딩 성공.");

                // 2. 총 북마크 개수 가져오기 (publicCount API)
                const publicCountRes = await fetch(`http://localhost:8080/bookBookmark/publicCount/${param.bookIsbn}`);
                if (publicCountRes.ok) {
                    const publicCount = await publicCountRes.json();
                    setBookBookmarkCount(publicCount);
                    console.log(`[Book.jsx] 총 북마크 개수: ${publicCount}`);
                } else {
                    console.error(`[Book.jsx] publicCount API 호출 실패: Status ${publicCountRes.status}, Text: ${publicCountRes.statusText}`);
                    setBookBookmarkCount(0);
                }

                // 3. 토큰 있을 경우 사용자별 북마크 상태 가져오기
                if (token) {
                    console.log("[Book.jsx] 토큰 존재. 사용자 북마크 상태 조회 시도.");
                    const bookmarkStatusRes = await fetch(`http://localhost:8080/bookBookmark/status/${param.bookIsbn}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!bookmarkStatusRes.ok) {
                        // 404 Not Found (북마크 없음), 401 Unauthorized (토큰 만료 등), 403 Forbidden (권한 없음)
                        // 어떤 에러든 일단 북마크 안 된 것으로 처리하고 에러 로그 남김
                        console.error(`[Book.jsx] 책 북마크 상태 조회 API 응답 실패: Status ${bookmarkStatusRes.status}, Text: ${bookmarkStatusRes.statusText}`);
                        setIsBookmarked(false);
                        setUserBookBookmarkId(null);
                    } else {
                        const bookmarkData = await bookmarkStatusRes.json(); // BookBookmarkStatusResponseDTO
                        setIsBookmarked(bookmarkData.bookmarked); // 'bookmarked' 필드 확인
                        setUserBookBookmarkId(bookmarkData.bookmarkId); // 'bookmarkId' 필드 확인
                        console.log(`[Book.jsx] 사용자 북마크 상태: ${bookmarkData.bookmarked}, ID: ${bookmarkData.bookmarkId}`);
                    }
                } else {
                    // 토큰이 없으면 무조건 북마크 안 된 상태
                    setIsBookmarked(false);
                    setUserBookBookmarkId(null);
                    console.log("[Book.jsx] 토큰 없음. 사용자는 북마크 안 된 상태로 표시.");
                }
                console.log("--- [Book.jsx] 책 정보 및 북마크 상태 로딩 완료 ---");

            } catch (err) {
                setError(err.message);
                console.error("[Book.jsx] 책 정보 및 북마크 상태 로딩 중 최종 오류 발생:", err);
            } finally {
                setLoading(false); // 로딩 종료 (성공 또는 실패 모두)
            }
        };

        fetchBookInfoAndBookmarkStatus();
    }, [param.bookIsbn, dispatch]); // bookIsbn이 변하거나 dispatch가 변할 때 재실행

    // 북마크 이미지 클릭 핸들러 (생성/삭제)
    const handleBookBookmarkClick = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            if (isBookmarked) {
                // 북마크 삭제
                if (!userBookBookmarkId) {
                    alert("북마크 ID를 찾을 수 없어 삭제할 수 없습니다. (재로그인 필요)");
                    return;
                }
                console.log(`[Book.jsx] 북마크 삭제 시도: ID ${userBookBookmarkId}`);
                const res = await fetch(`http://localhost:8080/bookBookmark/delete/${userBookBookmarkId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`북마크 삭제 실패: ${res.status} ${await res.text()}`);

                alert("즐겨찾기가 삭제되었습니다.");
                setIsBookmarked(false);
                setBookBookmarkCount(prev => Math.max(prev - 1, 0)); // 0보다 작아지지 않게
                setUserBookBookmarkId(null);
                console.log("[Book.jsx] 북마크 삭제 성공.");

            } else {
                // 북마크 생성
                console.log(`[Book.jsx] 북마크 생성 시도: bookIsbn ${param.bookIsbn}`);
                const res = await fetch('http://localhost:8080/bookBookmark/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ bookIsbn: param.bookIsbn })
                });
                if (!res.ok) throw new Error(`북마크 등록 실패: ${res.status} ${await res.text()}`);

                const newBookmarkId = await res.json(); // 생성된 북마크 ID 받기

                alert("즐겨찾기가 성공적으로 등록되었습니다.");
                setIsBookmarked(true);
                setBookBookmarkCount(prev => prev + 1);
                setUserBookBookmarkId(newBookmarkId);
                console.log(`[Book.jsx] 북마크 등록 성공. 새로운 ID: ${newBookmarkId}`);
            }
        } catch (err) {
            setError(err.message);
            alert(`오류 발생: ${err.message}`);
            console.error("[Book.jsx] 책 북마크 작업 중 오류 발생:", err);
        }
    };

    // 로딩 및 에러 UI 처리
    if (loading) return <div>로딩 중…</div>;
    if (error) return <div>오류 발생: {error}</div>;
    if (!book) return <div>책 정보를 불러올 수 없습니다.</div>;

    return (
        <div className={BookCSS.bookPage}>
            <div className={BookCSS.bookSection}>
                <div className={BookCSS.aladin}>
                    <p className={BookCSS.infoLight2}>도서 DB 제공 : 알라딘 인터넷서점(www.aladin.co.kr)</p>
                    <img className={BookCSS.bookCover} src={bookCover} alt={book.bookTitle}/>
                </div>
                <div className={BookCSS.bookInfo}>
                    <p className={BookCSS.bookTitle}>{book.bookTitle}</p>
                    <p className={BookCSS.reviewAndBookmark}>
                        리뷰 15 &nbsp; 북마크 {bookBookmarkCount}
                        <button className={BookCSS.buttonNone} onClick={handleBookBookmarkClick}>
                            <img
                                className={BookCSS.bookmarkImg}
                                src={isBookmarked ? bookMarkO : bookMarkX}
                                alt="BookMark"
                            />
                        </button>
                    </p>
                    <p className={BookCSS.infoBold}>{book.bookAuthor}</p>
                    <span className={BookCSS.infoBold}>{book.bookPublisher} <p className={BookCSS.infoLight}>출판</p></span>
                    <p className={BookCSS.infoBold}>작품 소개</p>
                    <div className={BookCSS.bookDescription}>
                        <p className={BookCSS.infoLight}>{book.bookDescription}</p>
                        <button className={BookCSS.more}>더보기</button>
                    </div>
                    <p className={BookCSS.infoBold}>관련 영상</p>
                    <VideosInBook keyword={book.bookTitle}/>
                </div>
            </div>
        </div>
    );
}

export default Book;