import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import profileImg1 from '../../assets/profileImg1.png'; 
import profileImg2 from '../../assets/profileImg2.png';
import profileImg3 from '../../assets/profileImg3.png';
import defaultImg from '../../assets/defaultImg.png';

import PostCSS from './Post.module.css';
import {
    callPostReviewAPI,
    callPostReviewWritingAPI,
    callPostReviewDeleteAPI
} from '../../apis/PostReviewAPICalls';

function ReviewSection({ postId, onReviewsLoaded }) { 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const postReviewData = useSelector(state => state.postReviewReducer);
    const pageInfo = postReviewData?.data?.pageInfo;
    const reviewsToList = postReviewData && postReviewData.data && postReviewData.data.data && Array.isArray(postReviewData.data.data) ? postReviewData.data.data : [];

    const { isLogin, userInfo } = useSelector(state => state.user);
    const loggedInUserId = userInfo?.userId; 

    console.log(JSON.stringify(postReviewData, null, 2))
    const [form, setForm] = useState({});
    const [newReviewContent, setNewReviewContent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    console.log(JSON.stringify(postReviewData, null, 2))

    // 리뷰 목록 로딩 useEffect
    useEffect(() => {
        if (postId) { // postId가 있을 때만 API 호출
            dispatch(callPostReviewAPI({
                postId: postId,
                currentPage: currentPage
            }));
        }
    }, [dispatch, postId, currentPage]);

    useEffect(() => {
        if (pageInfo && typeof onReviewsLoaded === 'function') {
            onReviewsLoaded(pageInfo.total);
        }
    }, [pageInfo, onReviewsLoaded]);
    
    const onNewReviewContentChangeHandler = (e) => { // 새 리뷰 입력 변경 시
        setNewReviewContent(e.target.value);
    };
    
    const onClickReviewWriteHandler = () => { // 새 리뷰 작성 핸들러
        if (!newReviewContent.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }
        dispatch(callPostReviewWritingAPI({ // API 함수명 확인 필요
            postId: postId, 
            form: { postReviewContent: newReviewContent, postId: postId } // API가 요구하는 형태로 form 전달
        })).then(() => {
            setNewReviewContent(''); // 입력창 초기화
            dispatch(callPostReviewAPI({ postId: postId, currentPage: currentPage })); // 리뷰 목록 새로고침
        });
    };

    const refreshReviews = useCallback(() => {
        if (postId) {
            console.log(`[refreshReviews] postId=${postId}, currentPage=${currentPage}로 리뷰 목록 새로고침`);
            dispatch(callPostReviewAPI({ postId: postId, currentPage: currentPage }));
        }
    }, [dispatch, postId, currentPage]);

    useEffect(() => {
        refreshReviews();
    }, [refreshReviews]);

    const onClickReviewDeleteHandler = async (reviewId) => {
        if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            try {
                // dispatch가 프로미스를 반환하도록 API 호출 함수를 수정했다면 await 사용 가능
                dispatch(callPostReviewDeleteAPI({ reviewId }));
                alert("리뷰가 삭제되었습니다.");
                refreshReviews(); // 목록 새로고침
            } catch (error) {
                alert("리뷰 삭제 중 오류가 발생했습니다.");
                console.error("리뷰 삭제 오류:", error);
            }
        }
    };

    const processedReviews = reviewsToList.map((reviewItem) => {
        const authorProfile = reviewItem.profileId;
        const authorPenName = authorProfile?.penName || "익명";
        
        // imageUrl은 이제 항상 전체 URL로 온다고 가정
        const authorProfileImageUrl = authorProfile?.imageUrl || defaultImg;
        
        // postReviewDate는 백엔드에서 이미 포맷팅된 문자열로 온다고 가정
        const displayReviewDate = reviewItem.postReviewDate || '날짜 정보 없음';

        // 가공된 정보와 원본 정보를 함께 새 객체로 반환
        return {
            ...reviewItem, // 원본 reviewItem의 모든 속성 복사
            // 화면 표시에 사용할 가공된 값들:
            displayAuthorPenName: authorPenName,
            displayAuthorImageUrl: authorProfileImageUrl,
            displayReviewDate: displayReviewDate
        };
    });
    
    return (
        <div className={PostCSS.postDetailReviewDiv}>
            <div>
                {/* 실제 댓글 수는 postReviewData.pageInfo?.totalElements 등으로 가져와야 합니다. */}
                <p className={PostCSS.postDetailReviews}>댓글 {pageInfo?.total || 0}</p>
            </div>

            {processedReviews.length > 0 ? (
                processedReviews.map((review) => {
                     const isMyReview = isLogin && loggedInUserId === review.profileId?.userId;

                     return( // 'review'는 이제 가공된 객체
                <div key={review.postReviewId || index}> {/* 고유 key 사용 */}
                    <div>
                        <div className={PostCSS.postDetailReviewProDiv}>
                            <img src={review.displayAuthorImageUrl} className={PostCSS.postDetailReviewIcon} alt="프로필"/> {/* 실제 데이터로 변경 */}
                            <div className={PostCSS.postDetailReviewProfile}>
                                <li>{review.displayAuthorPenName}</li> {/* 실제 데이터 필드명 사용 */}
                                <li>{review.displayReviewDate}</li>
                            </div>
                        </div>
                        <p className={PostCSS.postDetailReviewcon}>{review.postReviewContent}</p>
                        <div className={PostCSS.postDetailReviewLikeDiv}>
                            <div className={PostCSS.postDetailReviewBtDiv}>
                                {isMyReview && (
                                    <button 
                                        onClick={() => onClickReviewDeleteHandler(review.postReviewId)}
                                        className={PostCSS.postDetailReviewBt}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )})
        ) : (
            <p>아직 작성된 댓글이 없습니다.</p>
        )}
            
            {/* 페이징 UI */}
            {pageInfo && reviewsToList.length > 0 && ( // pageInfo가 있고, 리뷰 목록이 있을 때만 표시
                <div className={PostCSS.paginationContainer}> {/* 페이지네이션 컨테이너 스타일 필요 */}
                    
                    {/* 이전 버튼 */}
                    {pageInfo.prev && (
                        <button 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className={PostCSS.pageButton} // 버튼 스타일 필요
                        >
                            이전
                        </button>
                    )}

                    {/* 페이지 번호들 */}
                    {Array.from({ length: (pageInfo.pageEnd - pageInfo.pageStart + 1) }, (_, i) => pageInfo.pageStart + i)
                        .map(pNum => (
                            <button
                                key={pNum}
                                onClick={() => setCurrentPage(pNum)}
                                className={`${PostCSS.pageButton} ${pageInfo.cri.pageNum === pNum ? PostCSS.activePageButton : ''}`} // 현재 페이지 스타일
                                disabled={pageInfo.cri.pageNum === pNum} // 현재 페이지는 비활성화
                            >
                                {pNum}
                            </button>
                        ))}
                </div>
            )}

            <div className={PostCSS.postDetailReviewReDiv}>
                <input type="text"
                    name="postReview" // 이 input은 새 리뷰 작성이므로 name이 newReviewContent와 연결되도록 수정
                    value={newReviewContent}
                    onChange={onNewReviewContentChangeHandler}
                    placeholder='댓글 입력'
                    className={PostCSS.postDetailReviewRe} />
                <button onClick={onClickReviewWriteHandler} className={PostCSS.postDetailReviewReBt}>등록</button>
            </div>
        </div>
    );
}

export default ReviewSection;