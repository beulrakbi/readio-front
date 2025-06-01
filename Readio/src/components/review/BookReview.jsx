import { useEffect, useState } from "react";
import BookReviewCSS from "./BookReview.module.css";

// 좋아요 이미지 (예시 경로, 실제 경로로 대체 필요)
import heartIcon from '../../assets/likes2.png'; // 좋아요 아이콘 (빈)
import filledHeartIcon from '../../assets/likes.png'; // 좋아요 아이콘 (꽉 찬)

function BookReview({ bookIsbn, isLoggedIn, getAuthToken }) { // props로 bookIsbn, isLoggedIn, getAuthToken을 받습니다.
    const [reviewContent, setReviewContent] = useState(''); // 리뷰 입력창 내용
    const [reviews, setReviews] = useState([]); // 현재 책의 리뷰 목록
    const [loadingReviews, setLoadingReviews] = useState(true); // 리뷰 로딩 상태
    const [reviewsError, setReviewsError] = useState(null); // 리뷰 에러 상태

    // 리뷰 목록을 불러오는 함수
    const fetchReviews = async () => {
        setLoadingReviews(true);
        setReviewsError(null);
        try {
            console.log(`[BookReview.jsx] 리뷰 목록 조회 시작: bookIsbn=${bookIsbn}`);
            const reviewsRes = await fetch(`http://localhost:8080/bookReview/${bookIsbn}`);
            if (!reviewsRes.ok) {
                throw new Error(`리뷰 목록을 불러오는 데 실패했습니다: ${reviewsRes.status} ${reviewsRes.statusText}`);
            }
            const responseData = await reviewsRes.json();
            // 백엔드 ResponseDTO 구조에 따라 'data' 필드에서 실제 리뷰 목록을 가져오도록 조정
            const actualReviews = responseData.data || responseData; // ResponseDTO로 감싸져 있다면 .data, 아니면 전체 사용
            
            // createdAt이 LocalDateTime -> ISO String으로 오므로 Date 객체로 변환
            const formattedReviews = actualReviews.map(review => ({
                ...review,
                createdAt: new Date(review.createdAt) // ISO String을 Date 객체로 변환
            }));

            setReviews(formattedReviews);
            console.log("[BookReview.jsx] 리뷰 목록 로딩 성공:", formattedReviews);
        } catch (err) {
            setReviewsError(err.message);
            console.error("[BookReview.jsx] 리뷰 목록 로딩 중 오류 발생:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (bookIsbn) {
            fetchReviews();
        }
    }, [bookIsbn]); // bookIsbn이 변경될 때마다 리뷰 목록 새로고침

    // 리뷰 내용 변경 핸들러
    const handleReviewContentChange = (e) => {
        setReviewContent(e.target.value);
    };

    // 리뷰 작성 버튼 클릭 핸들러
    const handleReviewSubmit = async () => {
        const token = getAuthToken(); // Book 컴포넌트에서 전달받은 함수 사용
        if (!token) {
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
                    'Authorization': `Bearer ${token}` // 토큰 포함
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
            setReviewContent(''); // 입력창 비우기
            fetchReviews(); // 리뷰 등록 성공 후 목록 새로고침

        } catch (err) {
            setReviewsError(err.message);
            alert(`리뷰 작성 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 리뷰 작성 중 오류 발생:", err);
        }
    };

    // 날짜 포맷 함수 (YYYY. MM. DD 형식)
    const formatReviewDate = (dateObj) => {
        if (!(dateObj instanceof Date) || isNaN(dateObj)) return ''; // Date 객체인지 확인
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}. ${month}. ${day}`;
    };

    // 좋아요 버튼 클릭 핸들러 (예시, 실제 구현은 백엔드 API 연동 필요)
    const handleLikeClick = async (reviewId) => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }
        
        try {
            // 백엔드 likes API에 profileId가 필요하므로, 토큰에서 profileId를 추출하거나 백엔드에서 인증된 사용자 ID를 기반으로 profileId를 찾도록 해야 합니다.
            // 여기서는 컨트롤러에서 @AuthenticationPrincipal Long profileId를 받기로 했으므로, 프론트에서는 토큰만 보내면 됩니다.
            const res = await fetch(`http://localhost:8080/bookReview/reviews/${reviewId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`좋아요 실패: ${res.status} ${errorText}`);
            }
            alert("좋아요 처리되었습니다.");
            fetchReviews(); // 좋아요 수 업데이트를 위해 리뷰 목록 새로고침
        } catch (err) {
            alert(`좋아요 처리 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 좋아요 처리 오류:", err);
        }
    };

    // 신고 버튼 클릭 핸들러 (예시, 실제 구현은 백엔드 API 연동 필요)
    const handleReportClick = async (reviewId) => {
        const token = getAuthToken();
        if (!token) {
            alert("로그인 후 리뷰를 신고할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 신고하시겠습니까?")) {
            try {
                const res = await fetch(`http://localhost:8080/bookReview/${reviewId}/report`, {
                    method: 'PUT', // PUT 요청
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`신고 실패: ${res.status} ${errorText}`);
                }
                alert("리뷰가 신고되었습니다.");
                fetchReviews(); // 신고 카운트 업데이트를 위해 리뷰 목록 새로고침
            } catch (err) {
                alert(`신고 처리 중 오류 발생: ${err.message}`);
                console.error("[BookReview.jsx] 신고 처리 오류:", err);
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
                        disabled // 로그인 안 됐으면 비활성화
                    />
                )}
            </div>

            {/* 리뷰 목록 표시 */}
            {reviews.length === 0 ? (
                <p>아직 작성된 리뷰가 없습니다.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.reviewId} className={BookReviewCSS.review}>
                        <div className={BookReviewCSS.reviewInfo}>
                            <p className={BookReviewCSS.reviewInfoFont1}>
                                {/* penName이 없으면 profileId 또는 userId로 대체 */}
                                {review.penName ? review.penName : (review.profileId ? `User_${review.profileId}` : '익명')}
                            </p>
                            <p className={BookReviewCSS.reviewInfoFont2}>
                                {formatReviewDate(review.createdAt)}
                            </p>
                            <div className={BookReviewCSS.reviewBtBox}>
                                <button className={BookReviewCSS.reviewBt} onClick={() => handleLikeClick(review.reviewId)}>
                                    <img className={BookReviewCSS.likes} src={heartIcon} alt="Likes" /> {/* 좋아요 아이콘 */}
                                    {review.reportedCount} {/* 실제 좋아요 수는 review.likesCount (백엔드에서 제공 시) */}
                                </button>
                                {/* 백엔드에서 좋아요 수를 제공한다면 review.likesCount 같은 필드를 사용 */}
                                <button className={BookReviewCSS.reviewBt} onClick={() => handleReportClick(review.reviewId)}>
                                    신고하기
                                </button>
                            </div>
                        </div>
                        <div className={BookReviewCSS.reviewContent}>
                            <p>{review.reviewContent}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default BookReview;