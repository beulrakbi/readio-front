import { useEffect, useState } from "react";
import BookReviewCSS from "./BookReview.module.css";

// 좋아요 이미지 (예시 경로, 실제 경로로 대체 필요)
import filledHeartIcon from '../../assets/likes.png'; // 좋아요 아이콘 (꽉 찬)
import heartIcon from '../../assets/likes2.png'; // 좋아요 아이콘 (빈)

// 임시로 이 파일 내부에 getAuthHeader를 정의합니다.
// 만약 이 함수가 여러 컴포넌트에서 사용된다면, 별도의 유틸리티 파일로 분리하는 것이 좋습니다.
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // 또는 localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

function BookReview({ bookIsbn, isLoggedIn, onReviewsLoaded }) {
    const [reviewContent, setReviewContent] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
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
            
            const headers = getAuthHeader(); 

            const reviewsRes = await fetch(`http://localhost:8080/bookReview/${bookIsbn}`, {
                method: 'GET',
                headers: Object.keys(headers).length > 0 ? headers : {} // 토큰이 있을 때만 Authorization 헤더 추가
            });

            if (!reviewsRes.ok) {
                throw new Error(`리뷰 목록을 불러오는 데 실패했습니다: ${reviewsRes.status} ${reviewsRes.statusText}`);
            }
            const responseData = await reviewsRes.json();
            const actualReviews = responseData.data || responseData; 
            
            const formattedReviews = actualReviews.map(review => ({
                ...review,
                createdAt: new Date(review.createdAt)
            }));

            formattedReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            setReviews(formattedReviews);
            console.log("[BookReview.jsx] 리뷰 목록 로딩 성공:", formattedReviews);
            formattedReviews.forEach(review => {
                console.log(`DEBUG_FE: Review ID ${review.reviewId}, isLiked received: ${review.isLiked}, likesCount received: ${review.likesCount}`);
            });

            if (onReviewsLoaded) {
                onReviewsLoaded(formattedReviews.length); 
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
            const token = sessionStorage.getItem('accessToken'); 
                                                                    
            if (token) {
                try {
                    // JWT 토큰 디코딩
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setCurrentLoggedInUserId(decodedToken.sub); 
                    console.log("[BookReview.jsx] 로그인된 사용자 ID (토큰 디코딩 - decodedToken.sub):", decodedToken.sub);
                } catch (e) {
                    console.error("JWT 토큰 디코딩 실패 또는 토큰 형식 오류:", e);
                    setCurrentLoggedInUserId(null);
                }
            } else {
                setCurrentLoggedInUserId(null);
            }
            
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
        const authHeader = getAuthHeader(); 
        if (!authHeader['Authorization']) { 
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
                    ...authHeader 
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
            fetchReviews(); 

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

    // --- ✨ 좋아요 버튼 클릭 핸들러 수정 (백엔드 토글 로직 반영 및 낙관적 업데이트) ✨ ---
    const handleLikeClick = async (reviewId) => {
        const authHeader = getAuthHeader(); 
        if (!authHeader['Authorization']) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }
        
        // 낙관적 업데이트: UI를 먼저 업데이트하고 나서 백엔드 요청을 보냅니다.
        // 백엔드 요청이 실패하면 이전 상태로 되돌립니다.
        const originalReviews = [...reviews]; // 현재 리뷰 상태를 복사
        
        setReviews(prevReviews => prevReviews.map(review => {
            if (review.reviewId === reviewId) {
                // 좋아요 상태와 좋아요 수 즉시 변경
                return {
                    ...review,
                    isLiked: !review.isLiked, // 좋아요 상태 반전
                    likesCount: review.isLiked ? review.likesCount - 1 : review.likesCount + 1 // 좋아요 수 업데이트
                };
            }
            return review;
        }));

        try {
            // 백엔드의 토글 엔드포인트로 항상 POST 요청을 보냅니다.
            console.log(`[BookReview.jsx] 좋아요 토글 시도: reviewId=${reviewId}`);
            const res = await fetch(`http://localhost:8080/bookReview/${reviewId}/like-toggle`, { 
                method: 'POST', // 항상 POST로 보냄
                headers: authHeader 
            });

            if (!res.ok) {
                const errorBody = await res.json(); // JSON 응답을 파싱
                throw new Error(`좋아요 처리 실패: ${res.status} ${errorBody.message || res.statusText}`);
            }

            // 백엔드에서 최신 좋아요 수와 상태를 받아와 UI를 다시 한 번 정합시킵니다.
            // (낙관적 업데이트 후에도 서버 상태와 일치하도록 최종 업데이트)
            const responseData = await res.json();
            setReviews(prevReviews => prevReviews.map(review => {
                if (review.reviewId === reviewId) {
                    return {
                        ...review,
                        isLiked: responseData.isLiked, // 백엔드에서 온 최신 상태
                        likesCount: responseData.likesCount // 백엔드에서 온 최신 좋아요 수
                    };
                }
                return review;
            }));

            // alert(responseData.message); // 백엔드 메시지를 직접 보여줄 수도 있음

        } catch (err) {
            alert(`좋아요 처리 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 좋아요 처리 오류:", err);
            setReviews(originalReviews); // 오류 발생 시 원래 상태로 되돌림
        }
    };
    // --- ✨ 수정 끝 ✨ ---

    // 신고 버튼 클릭 핸들러
    const handleReportClick = async (reviewId) => {
        const authHeader = getAuthHeader(); 
        if (!authHeader['Authorization']) {
            alert("로그인 후 리뷰를 신고할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 신고하시겠습니까?")) {
            try {
                const res = await fetch(`http://localhost:8080/bookReview/${reviewId}/report`, {
                    method: 'PUT',
                    headers: authHeader 
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
        const authHeader = getAuthHeader(); 
        if (!authHeader['Authorization']) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 현재 로그인된 사용자가 리뷰 작성자인지 확인
        // currentLoggedInUserId는 string, reviewerUserId도 string이므로 toString() 필요 없음
        if (currentLoggedInUserId !== reviewerUserId) { 
            alert("자신이 작성한 리뷰만 삭제할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 삭제하시겠습니까?")) {
            try {
                console.log(`[BookReview.jsx] 리뷰 삭제 시도: ID ${reviewId}`);
                const res = await fetch(`http://localhost:8080/bookReview/delete/${reviewId}`, {
                    method: 'DELETE',
                    headers: authHeader 
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`리뷰 삭제 실패: ${res.status} ${errorText}`);
                }

                alert("리뷰가 삭제되었습니다.");
                fetchReviews(); 

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

            {reviews.length === 0 ? (
                <p>아직 작성된 리뷰가 없습니다.</p>
            ) : (
                <div className={BookReviewCSS.reviewListContainer}>
                    {reviews.map((review) => (
                        <div key={review.reviewId} className={BookReviewCSS.review}>
                            <div className={BookReviewCSS.reviewHeader}>
                                <div className={BookReviewCSS.reviewerInfo}>
                                    <p className={BookReviewCSS.reviewInfoFont1}>
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
                                            src={review.isLiked ? filledHeartIcon : heartIcon} 
                                            alt="Likes" 
                                        />
                                        {review.likesCount} 
                                    </button>
                                    {/* 신고하기 버튼: 로그인 상태일 때만 보이도록 조건부 렌더링 추가 */}
                                    {isLoggedIn && (
                                        <button className={BookReviewCSS.reviewBt} onClick={() => handleReportClick(review.reviewId)}>
                                            신고하기
                                        </button>
                                    )}
                                    {/* 삭제 버튼 (조건부 렌더링) */}
                                    {isLoggedIn && currentLoggedInUserId && (currentLoggedInUserId === review.reviewerUserId) && (
                                        <button
                                            className={BookReviewCSS.reviewBt}
                                            onClick={() => handleDeleteClick(review.reviewId, review.reviewerUserId)}
                                        >
                                            삭제
                                        </button>
                                    )}
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