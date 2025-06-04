import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { callBookAPI } from "../../apis/BookAPICalls.js";
import { saveClickLog } from '../../apis/StatisticsAPICalls';
import bookMarkO from '../../assets/bookMarkO.png';
import bookMarkX from '../../assets/bookMarkX.png';
import BookReview from "../review/BookReview.jsx";
import BookCSS from "./Book.module.css";
import VideosInBook from "./VideosInBook";

function Book() {
    const [book, setBook] = useState(null);
    const [bookCover, setBookCover] = useState('');
    const param = useParams();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookBookmarkCount, setBookBookmarkCount] = useState(0);
    const [userBookBookmarkId, setUserBookBookmarkId] = useState(null);
    const [description, setDescription] = useState('');
    const [more, setMore] = useState(false);
    // 로딩 상태 변수
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reviewsCount, setReviewsCount] = useState(0);

    const getAuthToken = () => {
        const token = sessionStorage.getItem('accessToken');
        return token;
    };

    const getAuthHeader = () => {
        const token = getAuthToken();
        console.log("필터링 토큰 :", token) // 개인 브랜치에서 추가된 디버깅 코드 유지
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // 마스터 브랜치의 getOrCreateAnonymousUserId 함수는 현재 사용되지 않지만,
    // 필요할 수 있으므로 그대로 유지합니다.
    const getOrCreateAnonymousUserId = () => "guest";

    const handleBookBookmarkClick = async () => {
        const authHeader = getAuthHeader();
        if (!authHeader['Authorization']) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            if (isBookmarked && userBookBookmarkId) {
                // 북마크 삭제 로직 (개인 브랜치와 동일하게 수정)
                console.log(`[Book.jsx] 북마크 삭제 시도: ID ${userBookBookmarkId}`);
                const res = await fetch(`http://localhost:8080/bookBookmark/delete/${userBookBookmarkId}`, {
                    method: 'DELETE',
                    headers: { 
                        Accept: '*/*', // Accept 헤더 추가
                        ...authHeader // 인증 헤더 적용
                    },
                });
                if (!res.ok) throw new Error(`북마크 삭제 실패: ${res.status} ${await res.text()}`);

                alert("즐겨찾기가 삭제되었습니다."); // 알림 추가
                setIsBookmarked(false);
                setBookBookmarkCount(prev => Math.max(prev - 1, 0)); // 0보다 작아지지 않도록 수정
                setUserBookBookmarkId(null);
                console.log("[Book.jsx] 북마크 삭제 성공.");
            } else {
                // 북마크 생성 로직 (개인 브랜치와 동일하게 수정)
                console.log(`[Book.jsx] 북마크 생성 시도: bookIsbn ${param.bookIsbn}`);
                const res = await fetch('http://localhost:8080/bookBookmark/create', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        Accept: '*/*', // Accept 헤더 추가
                        ...authHeader // 인증 헤더 적용
                    },
                    body: JSON.stringify({ bookIsbn: param.bookIsbn })
                });
                if (!res.ok) throw new Error(`북마크 등록 실패: ${res.status} ${await res.text()}`);

                const newBookmarkId = await res.json(); // 생성된 ID를 받아옴

                alert("즐겨찾기가 성공적으로 등록되었습니다."); // 알림 추가
                setIsBookmarked(true);
                setBookBookmarkCount(prev => prev + 1);
                setUserBookBookmarkId(newBookmarkId);
                console.log(`[Book.jsx] 북마크 등록 성공. 새로운 ID: ${newBookmarkId}`);
            }
        } catch (err) {
            setError(err.message);
            alert(`오류 발생: ${err.message}`); // 사용자에게 오류 알림
            console.error("북마크 처리 실패:", err);
        }
    };

    // useEffect 훅을 하나로 통합하고, 개인 브랜치의 로직을 반영합니다.
    useEffect(() => {
        const fetchBookInfoAndBookmarkStatus = async () => {
            setBook(null);
            setError(null);
            setLoading(true);

            const token = getAuthToken();
            setIsLoggedIn(!!token);

            const authHeader = getAuthHeader();

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

                // 초기 책 정보 로딩 시 클릭 로그 저장 (마스터 브랜치 기존 로직 유지)
                const userId = sessionStorage.getItem("userId") || getOrCreateAnonymousUserId();
                await saveClickLog({
                    contentId: param.bookIsbn,
                    contentType: "book",
                    action: "click",
                    userId,
                    timestamp: new Date().toISOString()
                });


                // 2. 총 북마크 개수 가져오기 (publicCount API) - 개인 브랜치와 동일하게 헤더 추가
                const publicCountRes = await fetch(`http://localhost:8080/bookBookmark/publicCount/${param.bookIsbn}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: '*/*',
                        ...getAuthHeader()      // 5.30 토큰 추가 (개인 브랜치와 동일)
                    },
                });

                if (publicCountRes.ok) {
                    const publicCount = await publicCountRes.json();
                    setBookBookmarkCount(publicCount);
                    console.log(`[Book.jsx] 총 북마크 개수: ${publicCount}`);
                } else {
                    console.error(`[Book.jsx] publicCount API 호출 실패: Status ${publicCountRes.status}, Text: ${publicCountRes.statusText}`);
                    setBookBookmarkCount(0);
                }

                // 3. 토큰 있을 경우 사용자별 북마크 상태 가져오기 - 개인 브랜치와 동일하게 헤더 추가
                if (authHeader['Authorization']) {
                    console.log("[Book.jsx] 토큰 존재. 사용자 북마크 상태 조회 시도.");
                    const bookmarkStatusRes = await fetch(`http://localhost:8080/bookBookmark/status/${param.bookIsbn}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: '*/*',
                            ...getAuthHeader()      // 5.30 토큰 추가 (개인 브랜치와 동일)
                        },
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
    }, [param.bookIsbn, dispatch]); // 의존성 배열에 dispatch 추가

    useEffect(() => {
        if (book) {
            let desc;
            if (!more) {
                desc = book.bookDescription.length > 55 ? book.bookDescription.slice(0, 55) + '...' : book.bookDescription;
            } else {
                desc = book.bookDescription;
            }
            setDescription(desc);
        }
    }, [book, more]);


    if (loading) return <div>로딩 중…</div>;
    if (error) return <div>오류 발생: {error}</div>;
    if (!book) return <div>책 정보를 불러올 수 없습니다.</div>;

    const onClickMore = () => {
        setMore(true);
    }
    const onClickFold = () => {
        setMore(false);
    }

    return (
        <div className={BookCSS.bookPage}>
            <div className={BookCSS.bookSection}>
                <div className={BookCSS.aladin}>
                    <p className={BookCSS.infoLight2}>도서 DB 제공 : 알라딘 인터넷서점(www.aladin.co.kr)</p>
                    <img className={BookCSS.bookCover} src={bookCover} alt={book.bookTitle} />
                </div>
                <div className={BookCSS.bookInfo}>
                    <p className={BookCSS.bookTitle}>{book.bookTitle}</p>
                    <p className={BookCSS.reviewAndBookmark}>
                        리뷰 {reviewsCount} &nbsp; 북마크 {bookBookmarkCount}
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
                        <p className={BookCSS.infoLight}>{JSON.stringify(description)}</p> {/* JSON.stringify 제거 */}
                        {!more ? <button className={BookCSS.more} onClick={() => onClickMore(description)}>더보기</button> :
                            <button className={BookCSS.more} onClick={() => onClickFold(description)}>접기</button>}
                    </div>
                    <p className={BookCSS.infoBold}>관련 영상</p>
                    <VideosInBook keyword={book.bookTitle} />
                </div>
            </div>
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