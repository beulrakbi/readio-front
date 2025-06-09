import { useEffect, useState } from "react";
import BookReviewCSS from "./BookReview.module.css";

import filledHeartIcon from '../../assets/likes.png';
import heartIcon from '../../assets/likes2.png';

const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

function BookReview({ bookIsbn, isLoggedIn, onReviewsLoaded }) {
    const [reviewContent, setReviewContent] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState(null);
    const [currentLoggedInUserRole, setCurrentLoggedInUserRole] = useState(null);   // 추가
    console.log("BookReview rendered. isLoggedIn:", isLoggedIn, "bookIsbn:", bookIsbn);

    const fetchReviews = async () => {
        setLoadingReviews(true);
        setReviewsError(null);
        console.log(`[BookReview.jsx] fetchReviews 시작: bookIsbn=${bookIsbn}`);
        try {
            const headers = getAuthHeader();
            console.log("[BookReview.jsx] fetchReviews - 요청 헤더:", headers);

            const reviewsRes = await fetch(`http://localhost:8080/bookReview/${bookIsbn}`, {
                method: 'GET',
                headers: Object.keys(headers).length > 0 ? headers : {}
            });

            console.log("[BookReview.jsx] fetchReviews - 응답 상태:", reviewsRes.status, reviewsRes.statusText);
            if (!reviewsRes.ok) {
                const errorText = await reviewsRes.text();
                console.error("[BookReview.jsx] fetchReviews - 응답 오류:", errorText);
                throw new Error(`리뷰 목록을 불러오는 데 실패했습니다: ${reviewsRes.status} ${errorText}`);
            }
            const responseData = await reviewsRes.json();
            console.log("[BookReview.jsx] fetchReviews - 전체 응답 데이터:", responseData);

            // 백엔드 ResponseDTO 구조에 따라 실제 리뷰 배열을 가져옴 (data 필드 확인)
            const actualReviews = responseData.data || responseData;
            console.log("[BookReview.jsx] fetchReviews - 실제 리뷰 데이터 (actualReviews):", actualReviews);


            if (!Array.isArray(actualReviews)) {
                console.error("[BookReview.jsx] fetchReviews - actualReviews가 배열이 아님:", actualReviews);
                throw new Error("리뷰 데이터 형식이 올바르지 않습니다.");
            }

            const formattedReviews = actualReviews.map(review => {
                // 백엔드에서 오는 review 객체 구조를 여기서 확인!
                console.log("[BookReview.jsx] fetchReviews - 매핑 전 개별 리뷰:", review);
                return {
                    ...review,
                    // isLiked와 likesCount는 백엔드에서 이미 BookReviewDTO에 포함되어 올 것으로 예상
                    // 만약 review.isLiked가 undefined라면 review.liked 등을 확인
                    isLiked: review.isLiked, // 또는 review.liked (백엔드 DTO 필드명 및 Jackson 설정에 따라 다름)
                    likesCount: review.likesCount,
                    createdAt: new Date(review.createdAt)
                };
            });

            formattedReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            setReviews(formattedReviews);
            console.log("[BookReview.jsx] 리뷰 목록 로딩 성공 (formattedReviews):", formattedReviews);
            formattedReviews.forEach(review => {
                // 이 로그는 매우 중요합니다. 백엔드에서 받은 isLiked 값이 올바르게 반영되는지 확인
                console.log(`DEBUG_FE (fetchReviews): Review ID ${review.reviewId}, isLiked received: ${review.isLiked}, likesCount received: ${review.likesCount}`);
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

    useEffect(() => {
        const loadReviewsAndUser = async () => {
            console.log("[BookReview.jsx] useEffect 실행: bookIsbn 또는 isLoggedIn 변경됨.");
            const token = sessionStorage.getItem('accessToken');
            if (token) {
                try {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    setCurrentLoggedInUserId(decodedToken.sub);
                    setCurrentLoggedInUserRole(decodedToken.role || decodedToken.auth || decodedToken.authority); // 정지권한 댓글 작성 제한 (6.9추가)
                    console.log("[BookReview.jsx] 로그인된 사용자 ID 설정 (decodedToken.sub):", decodedToken.sub, "권한:", decodedToken.role || decodedToken.auth || decodedToken.authority);
                } catch (e) {
                    console.error("JWT 토큰 디코딩 실패 또는 토큰 형식 오류:", e);
                    setCurrentLoggedInUserId(null);
                }
            } else {
                setCurrentLoggedInUserId(null);
                console.log("[BookReview.jsx] 토큰 없음, 로그인된 사용자 ID null로 설정.");
            }

            // bookIsbn이 유효할 때만 fetchReviews 호출
            if (bookIsbn) {
                await fetchReviews(); // fetchReviews가 완료될 때까지 기다릴 수 있도록 await 추가 (선택 사항)
            } else {
                console.log("[BookReview.jsx] bookIsbn이 유효하지 않아 fetchReviews를 호출하지 않음.");
                setReviews([]); // bookIsbn이 없으면 리뷰 목록을 비움
                setLoadingReviews(false);
            }
        };

        loadReviewsAndUser();
    }, [bookIsbn, isLoggedIn]); // isLoggedIn도 의존성 배열에 포함

    const handleReviewContentChange = (e) => {
        setReviewContent(e.target.value);
    };

    const handleReviewSubmit = async () => {
        const authHeader = getAuthHeader();
        if (!authHeader['Authorization']) {
            alert("로그인 후 리뷰를 작성할 수 있습니다.");
            return;
        }

        // 추가
        if (currentLoggedInUserRole === 'SUSPENDED') {
            alert("정지된 계정은 댓글을 작성할 수 없습니다.");
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

    const formatReviewDate = (dateObj) => {
        if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}. ${month}. ${day}`;
    };

    const handleLikeClick = async (reviewId) => {
        console.log(`[BookReview.jsx] handleLikeClick 호출: reviewId=${reviewId}`);
        const authHeader = getAuthHeader();
        if (!authHeader['Authorization']) {
            alert("로그인 후 좋아요를 누를 수 있습니다.");
            return;
        }

        const originalReviews = reviews.map(r => ({ ...r })); // 상태 롤백을 위한 깊은 복사

        // 1. 낙관적 업데이트
        setReviews(prevReviews => prevReviews.map(review => {
            if (review.reviewId === reviewId) {
                console.log(`[BookReview.jsx] 낙관적 업데이트 전: reviewId=${reviewId}, isLiked=${review.isLiked}, likesCount=${review.likesCount}`);
                const newIsLiked = !review.isLiked;
                const newLikesCount = newIsLiked ? review.likesCount + 1 : review.likesCount - 1;
                console.log(`[BookReview.jsx] 낙관적 업데이트 후: reviewId=${reviewId}, newIsLiked=${newIsLiked}, newLikesCount=${newLikesCount}`);
                return {
                    ...review,
                    isLiked: newIsLiked,
                    likesCount: newLikesCount < 0 ? 0 : newLikesCount // 좋아요 수가 음수가 되지 않도록 방어
                };
            }
            return review;
        }));

        try {
            console.log(`[BookReview.jsx] 좋아요 토글 API 요청 시작: reviewId=${reviewId}`);
            const res = await fetch(`http://localhost:8080/bookReview/${reviewId}/like-toggle`, {
                method: 'POST',
                headers: authHeader
            });

            console.log(`[BookReview.jsx] 좋아요 토글 API 응답 상태: ${res.status} ${res.statusText}`);

            if (!res.ok) {
                const errorBody = await res.json().catch(() => res.text()); // JSON 파싱 실패 시 텍스트로
                console.error(`[BookReview.jsx] 좋아요 API 실패 응답 본문:`, errorBody);
                throw new Error(`좋아요 처리 실패: ${res.status} ${errorBody.message || errorBody}`);
            }

            const responseData = await res.json();
            // 이 로그가 매우 중요합니다. 백엔드에서 받은 isLiked, likesCount 값을 확인
            console.log("[BookReview.jsx] 좋아요 토글 API 성공 응답 데이터 (responseData):", responseData);

            // 2. 서버 응답으로 최종 UI 업데이트 (정합성 맞추기)
            setReviews(prevReviews => prevReviews.map(review => {
                if (review.reviewId === reviewId) {
                    console.log(`[BookReview.jsx] 서버 응답 반영: reviewId=${reviewId}, responseData.isLiked=${responseData.isLiked}, responseData.likesCount=${responseData.likesCount}`);
                    return {
                        ...review,
                        isLiked: responseData.isLiked, // 백엔드에서 온 최신 상태
                        likesCount: responseData.likesCount // 백엔드에서 온 최신 좋아요 수
                    };
                }
                return review;
            }));

        } catch (err) {
            alert(`좋아요 처리 중 오류 발생: ${err.message}`);
            console.error("[BookReview.jsx] 좋아요 처리 오류:", err);
            // 오류 발생 시 낙관적 업데이트 롤백
            setReviews(originalReviews);
            console.log("[BookReview.jsx] 좋아요 오류로 인한 상태 롤백 완료.");
        }
    };

    // --- ⭐ handleReportClick 함수 수정 시작 ⭐ ---
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

                // ⭐ 백엔드에서 409 Conflict 상태 코드를 반환할 경우 처리
                if (res.status === 409) {
                    alert("이미 신고한 리뷰입니다."); // ⭐ 메시지를 "이미 신고하였습니다."로 고정
                    return; // 함수 종료
                }

                if (!res.ok) {
                    // 서버에서 에러 메시지를 JSON 형태로 반환할 경우 파싱 시도
                    const errorBody = await res.json().catch(() => res.text());
                    // 백엔드에서 이미 "이미 신고한 리뷰입니다." 같은 메시지를 message 필드에 담아 보내주므로 활용
                    const errorMessage = typeof errorBody === 'object' && errorBody !== null && errorBody.message
                        ? errorBody.message
                        : `신고 실패: ${res.status} ${errorBody}`; // 메시지 필드가 없으면 기본 에러 메시지 사용

                    // '신고 처리 중 오류 발생: ' 접두사를 제거하고, 에러 메시지 자체를 alert
                    alert(errorMessage);
                    console.error("[BookReview.jsx] 신고 처리 오류 (백엔드 에러):", errorMessage);
                    return; // 에러 처리 후 함수 종료
                }

                alert("리뷰가 신고되었습니다.");
                fetchReviews(); // 성공적으로 신고되었으면 리뷰 목록을 새로고침
            } catch (err) {
                // 네트워크 오류 등 fetch 자체에서 발생하는 오류 처리
                alert(`신고 처리 중 오류 발생: ${err.message}`);
                console.error("[BookReview.jsx] 신고 처리 오류 (프론트엔드/네트워크):", err);
            }
        }
    };
    // --- ⭐ handleReportClick 함수 수정 끝 ⭐ ---


    const handleDeleteClick = async (reviewId, reviewerUserId) => {
        const authHeader = getAuthHeader();
        if (!authHeader['Authorization']) {
            alert("로그인이 필요합니다.");
            return;
        }
        console.log(`[BookReview.jsx] 리뷰 삭제 시도: reviewId=${reviewId}, currentLoggedInUserId=${currentLoggedInUserId}, reviewerUserId=${reviewerUserId}`);
        if (String(currentLoggedInUserId) !== String(reviewerUserId)) { // ID 비교 시 타입을 문자열로 통일 (안전장치)
            alert("자신이 작성한 리뷰만 삭제할 수 있습니다.");
            return;
        }

        if (window.confirm("이 리뷰를 삭제하시겠습니까?")) {
            try {
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
                    {reviews.map((review) => {
                        // 렌더링 시점의 isLiked 값 확인
                        // console.log(`DEBUG_FE (render): Review ID ${review.reviewId}, isLiked: ${review.isLiked}, likesCount: ${review.likesCount}`);
                        return (
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
                                        <button className={BookReviewCSS.reviewBt} onClick={() => handleLikeClick(review.reviewId)}>
                                            <img
                                                className={BookReviewCSS.likes}
                                                src={review.isLiked ? filledHeartIcon : heartIcon}
                                                alt="Likes"
                                            />
                                            {/* 좋아요 수가 0일 때도 표시되도록 조건 제거 (필요시 조정) */}
                                            {review.likesCount}
                                        </button>
                                        {/* 신고하기 버튼 조건: 로그인되어 있고, 현재 사용자가 리뷰 작성자가 아닐 때만 표시 */}
                                        {isLoggedIn && currentLoggedInUserId && (String(currentLoggedInUserId) !== String(review.reviewerUserId)) && (
                                            <button className={BookReviewCSS.reviewBt} onClick={() => handleReportClick(review.reviewId)}>
                                                신고하기
                                            </button>
                                        )}
                                        {/* 삭제 버튼 조건은 그대로 유지 */}
                                        {isLoggedIn && currentLoggedInUserId && (String(currentLoggedInUserId) === String(review.reviewerUserId)) && (
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default BookReview;