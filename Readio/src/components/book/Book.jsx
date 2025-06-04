import { useEffect, useState } from "react";
import bookMarkO from '../../assets/bookMarkO.png';
import bookMarkX from '../../assets/bookMarkX.png';
import BookCSS from "./Book.module.css";
import VideosInBook from "./VideosInBook";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { callBookAPI } from "../../apis/BookAPICalls.js";
import BookReview from "../review/BookReview.jsx";
import { saveClickLog } from '../../apis/StatisticsAPICalls';

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
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    const getOrCreateAnonymousUserId = () => "guest";

    const handleBookBookmarkClick = async () => {
        const token = getAuthToken();
        if (!token) return alert("로그인이 필요합니다.");

        try {
            if (isBookmarked && userBookBookmarkId) {
                const res = await fetch(`http://localhost:8080/bookBookmark/${userBookBookmarkId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                });
                if (res.ok) {
                    setIsBookmarked(false);
                    setBookBookmarkCount(prev => prev - 1);
                }
            } else {
                const res = await fetch(`http://localhost:8080/bookBookmark/${param.bookIsbn}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsBookmarked(true);
                    setUserBookBookmarkId(data.bookmarkId);
                    setBookBookmarkCount(prev => prev + 1);
                }
            }
        } catch (err) {
            console.error("북마크 처리 실패:", err);
        }
    };

    useEffect(() => {
        const getBookInfo = async () => {
            const result = await dispatch(callBookAPI({ bookIsbn: param.bookIsbn }));
            setBook(result);
            if (result?.bookCover) {
                setBookCover(result.bookCover.replace("coversum", "cover500"));
            }
            const userId = sessionStorage.getItem("userId") || getOrCreateAnonymousUserId();
            await saveClickLog({
                contentId: param.bookIsbn,
                contentType: "book",
                action: "click",
                userId,
                timestamp: new Date().toISOString()
            });
        };
        getBookInfo();
    }, [param.bookIsbn]);

    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            setError(null);
            setLoading(true);

            const token = getAuthToken();
            setIsLoggedIn(!!token);
            const authHeader = getAuthHeader();

            try {
                const publicCountRes = await fetch(`http://localhost:8080/bookBookmark/publicCount/${param.bookIsbn}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', ...authHeader },
                });
                if (publicCountRes.ok) {
                    const publicCount = await publicCountRes.json();
                    setBookBookmarkCount(publicCount);
                }

                if (authHeader['Authorization']) {
                    const bookmarkStatusRes = await fetch(`http://localhost:8080/bookBookmark/status/${param.bookIsbn}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json', ...authHeader },
                    });
                    if (bookmarkStatusRes.ok) {
                        const bookmarkData = await bookmarkStatusRes.json();
                        setIsBookmarked(bookmarkData.bookmarked);
                        setUserBookBookmarkId(bookmarkData.bookmarkId);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBookmarkStatus();
    }, [param.bookIsbn]);

    useEffect(() => {
        if (book)
        {
            let desc;
            if (!more)
            {
                desc = book.bookDescription.length > 55 ? book.bookDescription.slice(0, 55) + '...' : book.bookDescription;
            }
            else
                desc = book.bookDescription;

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
                        <p className={BookCSS.infoLight}>{JSON.stringify(description)}</p>
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