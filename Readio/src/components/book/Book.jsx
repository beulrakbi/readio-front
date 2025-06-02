import { useEffect, useState } from "react";
import bookMarkO from '../../assets/bookMarkO.png';
import bookMarkX from '../../assets/bookMarkX.png';
import BookCSS from "./Book.module.css";
import VideosInBook from "./VideosInBook";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { callBookAPI } from "../../apis/BookAPICalls.js";
import BookReview from "../review/BookReview.jsx"; // BookReview 컴포넌트 임포트

function Book() {
    const [book, setBook] = useState(null);
    const [bookCover, setBookCover] = useState('');
    const param = useParams();
    const dispatch = useDispatch();

    // 책 북마크 관련 상태
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookBookmarkCount, setBookBookmarkCount] = useState(0);
    const [userBookBookmarkId, setUserBookBookmarkId] = useState(null);

    // 로딩 상태 변수
    const [loading, setLoading] = useState(true);

    // 로그인 상태 (BookReview 컴포넌트로 전달)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 리뷰 개수를 저장할 상태
    const [reviewsCount, setReviewsCount] = useState(0); 

    // 로컬 스토리지에서 인증 토큰을 가져오는 함수 (BookReview 컴포넌트로 전달)
    const getAuthToken = () => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token); // 토큰 유무에 따라 로그인 상태 업데이트
        return token;
    };

    // 책 정보 및 북마크 상태/개수를 가져오는 비동기 함수
    useEffect(() => {
        const fetchBookInfoAndBookmarkStatus = async () => {
            setBook(null);
            setError(null);
            setLoading(true);
            const token = getAuthToken(); // 로그인 상태 업데이트 포함

            try {
                console.log("--- [Book.jsx] 책 정보 및 북마크 상태 로딩 시작 ---");
                
                // 1. 책 기본 정보 가져오기 (Redux Thunk 사용)
                const bookInfoResult = await dispatch(callBookAPI({ bookIsbn: param.bookIsbn }));
                const bookDataFromApi = bookInfoResult; 

                if (!bookDataFromApi || !bookDataFromApi.bookIsbn) {
                    throw new Error("책 기본 정보를 불러오는 데 실패했습니다. (데이터 부족 또는 잘못된 형식)");
                }
                
                setBook(bookDataFromApi);
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
                        console.error(`[Book.jsx] 책 북마크 상태 조회 API 응답 실패: Status ${bookmarkStatusRes.status}, Text: ${bookmarkStatusRes.statusText}`);
                        setIsBookmarked(false);
                        setUserBookBookmarkId(null);
                    } else {
                        const bookmarkData = await bookmarkStatusRes.json();
                        setIsBookmarked(bookmarkData.bookmarked);
                        setUserBookBookmarkId(bookmarkData.bookmarkId);
                        console.log(`[Book.jsx] 사용자 북마크 상태: ${bookmarkData.bookmarked}, ID: ${bookmarkData.bookmarkId}`);
                    }
                } else {
                    setIsBookmarked(false);
                    setUserBookBookmarkId(null);
                    console.log("[Book.jsx] 토큰 없음. 사용자는 북마크 안 된 상태로 표시.");
                }

                console.log("--- [Book.jsx] 책 정보 및 북마크 상태 로딩 완료 ---");

            } catch (err) {
                setError(err.message);
                console.error("[Book.jsx] 책 정보, 북마크 로딩 중 최종 오류 발생:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookInfoAndBookmarkStatus();
    }, [param.bookIsbn, dispatch]);

    // 북마크 이미지 클릭 핸들러 (생성/삭제)
    const handleBookBookmarkClick = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        const getBookInfo = async () => {
            const foundBook = await dispatch(callBookAPI({bookIsbn: param.bookIsbn}));
            setBook(foundBook);
        }

        try {
            if (isBookmarked) {
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
                setBookBookmarkCount(prev => Math.max(prev - 1, 0));
                setUserBookBookmarkId(null);
                console.log("[Book.jsx] 북마크 삭제 성공.");

            } else {
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

                const newBookmarkId = await res.json();

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
                        리뷰 {reviewsCount} &nbsp; 북마크 {bookBookmarkCount} {/* 리뷰 개수를 reviewsCount로 변경 */}
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

            {/* BookReview 컴포넌트를 여기에 렌더링하고 필요한 props 전달 */}
            <BookReview
                bookIsbn={param.bookIsbn}
                isLoggedIn={isLoggedIn}
                getAuthToken={getAuthToken}
                onReviewsLoaded={setReviewsCount}
            />
        </div>
    );
}

export default Book;