import { useEffect, useState } from "react";
import BookReviewCSS from "./BookReview.module.css";

// 좋아요 이미지 (예시 경로, 실제 경로로 대체 필요)
import filledHeartIcon from '../../assets/likes.png'; // 좋아요 아이콘 (꽉 찬)
import heartIcon from '../../assets/likes2.png'; // 좋아요 아이콘 (빈)

// 임시로 이 파일 내부에 getAuthHeader를 정의합니다.
// 만약 이 함수가 여러 컴포넌트에서 사용된다면, 별도의 유틸리티 파일로 분리하는 것이 좋습니다.
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // 또는 localStorage.getItem('accessToken');
    // console.log("BookReview.jsx: getAuthHeader 토큰:", token); // 디버깅용
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};


function BookReview({ bookIsbn, isLoggedIn, onReviewsLoaded }) {
    const [reviewContent, setReviewContent] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);

    // 현재 로그인된 사용자의 userId 상태 추가
    const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState(null);

    // --- 디버깅 로그 추가 (최종 배포 시 제거 권장) ---
    console.log("BookReview rendered. isLoggedIn:", isLoggedIn);
    console.log("BookReview rendered. currentLoggedInUserId (before useEffect):", currentLoggedInUserId);
    // --- ------------- ---

    // 리뷰 목록을 불러오는 함수
    const fetchReviews = async () => {
        setLoadingReviews(true);
        setReviewsError(null);
        try {
            console.log(`[BookReview.jsx] 리뷰 목록 조회 시작: bookIsbn=${bookIsbn}`);
            
            // 리뷰 조회는 인증이 필수는 아닐 수 있으므로, 헤더를 조건부로 추가합니다.
            // 하지만 백엔드에서 `isLiked` 정보를 주려면 토큰이 필요합니다.
            const headers = getAuthHeader(); // 인증 헤더 가져오기

            const reviewsRes = await fetch(`http://localhost:8080/bookReview/${bookIsbn}`, {
                method: 'GET',
                // 토큰이 존재할 경우에만 Authorization 헤더를 추가합니다.
                // 이렇게 하면 로그인하지 않은 사용자도 리뷰를 볼 수 있습니다.
                headers: Object.keys(headers).length > 0 ? headers : {}
            });

            if (!reviewsRes.ok) {
                throw new Error(`리뷰 목록을 불러오는 데 실패했습니다: ${reviewsRes.status} ${reviewsRes.statusText}`);
            }
            const responseData = await reviewsRes.json();
            const actualReviews = responseData.data || responseData; 
            
            // createdAt이 LocalDateTime -> ISO String으로 오므로 Date 객체로 변환
            const formattedReviews = actualReviews.map(review => ({
                ...review,
                createdAt: new Date(review.createdAt)
            }));

            // --- ✨ 최신 리뷰가 위에 오도록 정렬하는 로직 추가 ✨ ---
            formattedReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            // ---------------------------------------------------

            setReviews(formattedReviews);
            console.log("[BookReview.jsx] 리뷰 목록 로딩 성공:", formattedReviews);
            // --- ✨ 추가된 디버깅 로그 ✨ ---
            formattedReviews.forEach(review => {
                console.log(`DEBUG_FE: Review ID ${review.reviewId}, isLiked received: ${review.isLiked}, likesCount received: ${review.likesCount}`);
            });
            // -----------------------------

            if (onReviewsLoaded) {
                onReviewsLoaded(formattedReviews.length); // 부모 컴포넌트로 리뷰 개수 전달
            }

        } catch (err) {
            setReviewsError(err.message);
            console.error("[BookReview.jsx] 리뷰 목록 로딩 중 오류 발생:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    // 컴포넌트 마운트 시, 또는 bookIsbn 변경 시 리뷰 목록 및 사용자 정보 로드
    useEffect(() => {
        const loadReviewsAndUser = async () => {
            // 사용자 정보 설정
            // Book.jsx와 통일성을 위해 sessionStorage에서 토큰을 가져오도록 변경
            const token = sessionStorage.getItem('accessToken'); 
                                                                    
            if (token) {
                try {
                    // JWT 토큰 디코딩 라이브러리를 사용한다면
                    // const decodedToken = jwtDecode(token);
                    // 또는 수동 디코딩
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setCurrentLoggedInUserId(decodedToken.sub); // 'sub'는 보통 userId를 나타냅니다.
                    console.log("[BookReview.jsx] 로그인된 사용자 ID (토큰 디코딩 - decodedToken.sub):", decodedToken.sub);
                } catch (e) {
                    console.error("JWT 토큰 디코딩 실패 또는 토큰 형식 오류:", e);
                    setCurrentLoggedInUserId(null);
                }
            } else {
                setCurrentLoggedInUserId(null);
            }
            
            // 리뷰 목록 불러오기
            fetchReviews();
        };

        if (bookIsbn) {
            loadReviewsAndUser();
        }
    }, [bookIsbn, isLoggedIn]); // isLoggedIn도 의존성 배열에 추가하여 로그인 상태 변화 시 리뷰 목록 새로고침

    // 리뷰 내용 변경 핸들러
    const handleReviewContentChange = (e) => {
        setReviewContent(e.target.value);
    };

    // 리뷰 작성 버튼 클릭 핸들러
    const handleReviewSubmit = async () => {
        const authHeader = getAuthHeader(); // 인증 헤더 가져오기
        if (!authHeader['Authorization']) { // 헤더에 Authorization이 없으면 토큰이 없는 것
            alert("로그인 후 리뷰를 작성할 수 있습니다.");
            return;
        }
        if (!reviewContent.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }

        try {
            console.log("[BookReview.jsx] 리뷰 작성 시도:", { bookIsbn, reviewContent });
            const res = await fetch('http://localhost:8080/bookReview/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader // 인증 헤더 적용
                },
                body: JSON.stringify({
                    bookIsbn: bookIsbn,
                    reviewContent: reviewContent
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`리뷰 작성 실패: ${res.status} ${errorText}`);
            }

            alert("리뷰가 성공적으로 등록되었습니다.");
            setReviewContent('');
            fetchReviews(); // 리뷰 등록 성공 후 목록 새로고침

        } catch (err) {
            setReviewsError(err.message);
            alert(`리뷰 작성 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 리뷰 작성 중 오류 발생:", err);
        }
    };

    // 날짜 포맷 함수 (YYYY. MM. DD 형식)
    const formatReviewDate = (dateObj) => {
        if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}. ${month}. ${day}`;
    };

    // 좋아요 버튼 클릭 핸들러 (수정)
    const handleLikeClick = async (reviewId) => {
        const authHeader = getAuthHeader(); // 인증 헤더 가져오기
        if (!authHeader['Authorization']) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }
        
        try {
            // --- ✨ 추가된 디버깅 로그 ✨ ---
            const currentReviewState = reviews.find(r => r.reviewId === reviewId);
            console.log(`DEBUG_FE_CLICK: Review ID ${reviewId}, currentReviewState.isLiked: ${currentReviewState ? currentReviewState.isLiked : 'N/A'}`);
            // -----------------------------

            // 현재 리뷰의 좋아요 상태를 찾아 등록/해제 요청 구분
            const reviewToToggle = reviews.find(r => r.reviewId === reviewId);
            if (!reviewToToggle) {
                console.error("좋아요를 누를 리뷰를 찾을 수 없습니다.");
                return;
            }

            let res;
            if (reviewToToggle.isLiked) { // 이미 좋아요를 눌렀다면, 좋아요 해제 (DELETE)
                console.log(`[BookReview.jsx] 좋아요 해제 시도: reviewId=${reviewId}`);
                res = await fetch(`http://localhost:8080/bookReview/review/${reviewId}/like`, { // DELETE 요청
                    method: 'DELETE',
                    headers: authHeader // 인증 헤더 적용
                });
            } else { // 좋아요를 누르지 않았다면, 좋아요 등록 (POST)
                console.log(`[BookReview.jsx] 좋아요 등록 시도: reviewId=${reviewId}`);
                res = await fetch(`http://localhost:8080/bookReview/reviews/${reviewId}/like`, { // POST 요청
                    method: 'POST',
                    headers: authHeader // 인증 헤더 적용
                });
            }

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`좋아요 처리 실패: ${res.status} ${errorText}`);
            }

            // alert(reviewToToggle.isLiked ? "좋아요가 해제되었습니다." : "좋아요 처리되었습니다.");
            fetchReviews(); // 좋아요 상태 및 카운트 업데이트를 위해 리뷰 목록 새로고침

        } catch (err) {
            alert(`좋아요 처리 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 좋아요 처리 오류:", err);
        }
    };

    // 신고 버튼 클릭 핸들러
    const handleReportClick = async (reviewId) => {
        const authHeader = getAuthHeader(); // 인증 헤더 가져오기
        if (!authHeader['Authorization']) {
            alert("로그인 후 리뷰를 신고할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 신고하시겠습니까?")) {
            try {
                const res = await fetch(`http://localhost:8080/bookReview/${reviewId}/report`, {
                    method: 'PUT',
                    headers: authHeader // 인증 헤더 적용
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`신고 실패: ${res.status} ${errorText}`);
                }
                alert("리뷰가 신고되었습니다.");
                fetchReviews();
            } catch (err) {
                alert(`신고 처리 중 오류 발생: ${err.message}`);
                console.error("[BookReview.jsx] 신고 처리 오류:", err);
            }
        }
    };

    // 리뷰 삭제 핸들러
    const handleDeleteClick = async (reviewId, reviewerUserId) => {
        const authHeader = getAuthHeader(); // 인증 헤더 가져오기
        if (!authHeader['Authorization']) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 현재 로그인된 사용자가 리뷰 작성자인지 확인
        if (currentLoggedInUserId !== reviewerUserId) {
            alert("자신이 작성한 리뷰만 삭제할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 삭제하시겠습니까?")) {
            try {
                console.log(`[BookReview.jsx] 리뷰 삭제 시도: ID ${reviewId}`);
                const res = await fetch(`http://localhost:8080/bookReview/delete/${reviewId}`, {
                    method: 'DELETE',
                    headers: authHeader // 인증 헤더 적용
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`리뷰 삭제 실패: ${res.status} ${errorText}`);
                }

                alert("리뷰가 삭제되었습니다.");
                fetchReviews(); // 삭제 후 리뷰 목록 새로고침

            } catch (err) {
                alert(`리뷰 삭제 중 오류 발생: ${err.message}`);
                console.error("[BookReview.jsx] 리뷰 삭제 중 오류 발생:", err);
            }
        }
    };


    if (loadingReviews) return <div className={BookReviewCSS.reviewWriteContainer}>리뷰 로딩 중...</div>;
    if (reviewsError) return <div className={BookReviewCSS.reviewWriteContainer}>리뷰 로딩 오류: {reviewsError}</div>;

    return (
        <div className={BookReviewCSS.reviewWriteContainer}>
            <p className={BookReviewCSS.infoBold}>리뷰</p>
            <div className={BookReviewCSS.rating}>
                {/* 별점 기능이 있다면 여기에 추가 */}
            </div>
            <div className={BookReviewCSS.reviewInput}>
                {isLoggedIn ? (
                    <>
                        <textarea
                            className={BookReviewCSS.writeInput}
                            placeholder="리뷰 내용을 입력하세요."
                            value={reviewContent}
                            onChange={handleReviewContentChange}
                        />
                        <button className={BookReviewCSS.writeButton} onClick={handleReviewSubmit}>
                            작성
                        </button>
                    </>
                ) : (
                    <textarea
                        className={BookReviewCSS.writeInput}
                        placeholder="로그인 후 리뷰를 작성할 수 있습니다."
                        disabled
                    />
                )}
            </div>

            {/* --- ✨ 리뷰 목록 표시를 위한 새로운 컨테이너 추가 및 정렬 로직 적용 ✨ --- */}
            {reviews.length === 0 ? (
                <p>아직 작성된 리뷰가 없습니다.</p>
            ) : (
                <div className={BookReviewCSS.reviewListContainer}> {/* <-- 이 부분 추가 */}
                    {reviews.map((review) => (
                        <div key={review.reviewId} className={BookReviewCSS.review}>
                            <div className={BookReviewCSS.reviewHeader}>
                                <div className={BookReviewCSS.reviewerInfo}>
                                    <p className={BookReviewCSS.reviewInfoFont1}>
                                        {/* penName이 없으면 profileId 또는 userId로 대체 */}
                                        {review.penName ? review.penName : (review.reviewerUserId ? `User_${review.reviewerUserId}` : '익명')}의 리뷰
                                    </p>
                                    <p className={BookReviewCSS.reviewInfoFont2}>
                                        {formatReviewDate(review.createdAt)}
                                    </p>
                                </div>
                                <div className={BookReviewCSS.reviewBtBox}>
                                    {/* 좋아요 버튼 */}
                                    <button className={BookReviewCSS.reviewBt} onClick={() => handleLikeClick(review.reviewId)}>
                                        <img 
                                            className={BookReviewCSS.likes} 
                                            src={review.isLiked ? filledHeartIcon : heartIcon} // <-- 좋아요 상태에 따라 이미지 변경
                                            alt="Likes" 
                                        />
                                        {review.likesCount} {/* <-- 실제 좋아요 수 표시 */}
                                    </button>
                                    {/* 신고하기 버튼: 로그인 상태일 때만 보이도록 조건부 렌더링 추가 */}
                                    {isLoggedIn && (
                                        <button className={BookReviewCSS.reviewBt} onClick={() => handleReportClick(review.reviewId)}>
                                            신고하기
                                        </button>
                                    )}
                                    {/* --- 삭제 버튼 (조건부 렌더링) --- */}
                                    {/* console.log(`Review ID: ${review.reviewId}, Reviewer: ${review.reviewerUserId}, Current User: ${currentLoggedInUserId}, Condition: ${isLoggedIn && currentLoggedInUserId === review.reviewerUserId}`); // <-- 각 리뷰별 조건 확인 로그 */}
                                    {isLoggedIn && currentLoggedInUserId && (currentLoggedInUserId.toString() === review.reviewerUserId.toString()) && (
                                        <button
                                            className={BookReviewCSS.reviewBt}
                                            onClick={() => handleDeleteClick(review.reviewId, review.reviewerUserId)}
                                        >
                                            삭제
                                        </button>
                                    )}
                                    {/* --- ----------- --- */}
                                </div>
                            </div>
                            <div className={BookReviewCSS.reviewContent}>
                                <p>{review.reviewContent}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookReview;