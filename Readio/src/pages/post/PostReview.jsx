import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // navigate 함수 사용을 위해 import

// 이미지 import (경로는 실제 프로젝트에 맞게 조정)
import profileImg1 from '../../assets/profileImg1.png'; // 댓글 작성자 프로필 이미지용
import profileImg2 from '../../assets/profileImg2.png';
import profileImg3 from '../../assets/profileImg3.png';

import PostCSS from './Post.module.css'; // PostDetail과 같은 CSS를 사용하거나, 별도 CSS 경로 지정
import {
    callPostReviewAPI,
    callPostReviewWritingAPI, // 원래 코드에서 Writing 함수명 확인 필요
    callPostReviewUpdateAPI
} from '../../apis/PostReviewAPICalls';

// ReviewSection 컴포넌트는 postId를 props로 받습니다.
function ReviewSection({ postId }) { 
    const dispatch = useDispatch();
    const navigate = useNavigate(); // navigate 함수 초기화

    // 리뷰 관련 상태 (원래 PostDetail에 있던 것들)
    // postReviewReducer의 상태 구조에 따라 postReview 객체를 가져옵니다.
    // 예: state.postReviewReducer.data 또는 state.postReviewReducer.reviews 등
    const postReviewData = useSelector(state => state.postReviewReducer); 
    const [modifyMode, setModifyMode] = useState(false);
    const [form, setForm] = useState({}); // 수정 시 사용될 폼 데이터
    const [newReviewContent, setNewReviewContent] = useState(''); // 새 리뷰 작성을 위한 별도 상태

    // 리뷰 목록 로딩 useEffect
    useEffect(() => {
        if (postId) { // postId가 있을 때만 API 호출
            dispatch(callPostReviewAPI({
                postId: postId
            }));
        }
    }, [dispatch, postId]); // 의존성 배열에 dispatch, postId 추가

    // 핸들러 함수들 (원래 PostDetail에 있던 것들)
    const onChangeHandler = (e) => { // 수정 폼 입력 변경 시
        setForm({
            ...form,
            [e.target.name]: e.target.value // 'name' 속성이 input/textarea에 있어야 함
        });
    };
    
    const onNewReviewContentChangeHandler = (e) => { // 새 리뷰 입력 변경 시
        setNewReviewContent(e.target.value);
    };

    // 수정 모드 진입 시, 해당 리뷰의 정보로 form 상태를 설정합니다.
    // 이 함수는 실제 리뷰 아이템의 '수정' 버튼에서 호출되어야 하며, 해당 review 객체를 받아야 합니다.
    const onClickModifyModeHandler = (reviewToModify) => {
        setModifyMode(true);
        setForm({ // 수정할 리뷰의 ID와 내용을 form 상태에 설정
            postReviewId: reviewToModify.postReviewId, // reviewToModify 객체에 이 필드들이 있다고 가정
            postReviewContent: reviewToModify.postReviewContent // 필드명은 실제 데이터 구조에 맞게
        });
        // 새 리뷰 입력창은 비워두거나 숨김 처리
        setNewReviewContent(''); 
    };

    const onClickReviewUpdateHandler = () => {
        // form 상태에 postReviewId와 수정된 postReviewContent가 있어야 함
        if (!form.postReviewId || !form.postReviewContent) {
            alert("수정할 내용이 없거나 대상 리뷰가 선택되지 않았습니다.");
            return;
        }
        dispatch(callPostReviewUpdateAPI({
            form: form // form 객체 안에 postReviewId, postReviewContent 등이 포함되어 API로 전달
        })).then(() => { // API 호출이 성공적으로 완료된 후 실행될 로직 (선택적)
            setModifyMode(false); // 수정 모드 해제
            dispatch(callPostReviewAPI({ postId: postId })); // 리뷰 목록 새로고침
            // window.location.reload(); // 전체 페이지 새로고침은 가급적 피하는 것이 좋습니다.
            // navigate(`/post/${postId}`, { replace: true }); // 필요시 사용하되, reload보다는 상태 업데이트 권장
        });
    };

    const onClickReviewWriteHandler = () => { // 새 리뷰 작성 핸들러
        if (!newReviewContent.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }
        dispatch(callPostReviewWritingAPI({ // API 함수명 확인 필요
            postId: postId, 
            form: { postReviewContent: newReviewContent } // API가 요구하는 형태로 form 전달
        })).then(() => {
            setNewReviewContent(''); // 입력창 초기화
            dispatch(callPostReviewAPI({ postId: postId })); // 리뷰 목록 새로고침
        });
    };

    // postReviewData에서 실제 리뷰 목록을 추출합니다. (Redux 상태 구조에 따라 변경 필요)
    // 예시: postReviewData가 { data: [...], pageInfo: ... } 형태일 경우
    const reviewsToList = postReviewData && postReviewData.data && Array.isArray(postReviewData.data) ? postReviewData.data : [];
    
    return (
        <div className={PostCSS.postDetailReviewDiv}>
            <div>
                {/* 실제 댓글 수는 postReviewData.pageInfo?.totalElements 등으로 가져와야 합니다. */}
                <p className={PostCSS.postDetailReviews}>댓글 {reviewsToList.length}</p>
            </div>

            {/* 리뷰 목록 표시 (기존 JSX 구조 유지) */}
            {reviewsToList.map((reviewItem, index) => (
                <div key={reviewItem.postReviewId || index}> {/* 고유 key 사용 */}
                    {modifyMode && form.postReviewId === reviewItem.postReviewId ? (
                        // 수정 모드 UI
                        <div>
                            <textarea 
                                name="postReviewContent" // onChangeHandler가 e.target.name을 사용하므로 추가
                                value={form.postReviewContent} 
                                onChange={onChangeHandler}
                                className={PostCSS.postDetailReviewRe} /* 스타일 확인 */
                            />
                            <button onClick={onClickReviewUpdateHandler} className={PostCSS.postDetailReviewReBt}>수정 완료</button>
                            <button onClick={() => setModifyMode(false)} className={PostCSS.postDetailReviewReBt}>취소</button>
                        </div>
                    ) : (
                        // 일반 리뷰 표시 UI
                        <div className={PostCSS.postDetailReviewProDiv}>
                            <img src={profileImg2} className={PostCSS.postDetailReviewIcon} alt="프로필"/> {/* 실제 데이터로 변경 */}
                            <div className={PostCSS.postDetailReviewProfile}>
                                <li>{reviewItem.memberNickname || "익명"}</li> {/* 실제 데이터 필드명 사용 */}
                                <li>{reviewItem.postReviewDate ? new Date(reviewItem.postReviewDate).toLocaleDateString() : "날짜없음"}</li>
                            </div>
                            <p className={PostCSS.postDetailReviewcon}>{reviewItem.postReviewContent}</p>
                            <div className={PostCSS.postDetailReviewLikeDiv}>
                                <p className={PostCSS.postDetailReviewLike}>좋아요 {reviewItem.likesCount || 0}</p> {/* 실제 데이터 필드명 사용 */}
                                <div className={PostCSS.postDetailReviewBtDiv}>
                                    {/* 현재 사용자와 리뷰 작성자가 동일한 경우에만 수정/삭제 버튼 표시 (인증 로직 필요) */}
                                    <button onClick={() => onClickModifyModeHandler(reviewItem)} className={PostCSS.postDetailReviewBt}>수정</button>
                                    <button className={PostCSS.postDetailReviewBt}>삭제</button> {/* 삭제 핸들러 연결 필요 */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            
            {/* 페이징 UI (기존 JSX 유지, 실제 페이징 로직은 추가 구현 필요) */}
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '15px' }}>1 | 2 | 3</p>
            </div>

            {/* 리뷰 작성 폼 (수정 모드가 아닐 때만 표시) */}
            {!modifyMode && (
                <div className={PostCSS.postDetailReviewReDiv}>
                    <input type="text"
                        name="postReview" // 이 input은 새 리뷰 작성이므로 name이 newReviewContent와 연결되도록 수정
                        value={newReviewContent}
                        onChange={onNewReviewContentChangeHandler}
                        placeholder='댓글 입력'
                        className={PostCSS.postDetailReviewRe} />
                    <button onClick={onClickReviewWriteHandler} className={PostCSS.postDetailReviewReBt}>등록</button>
                </div>
            )}
        </div>
    );
}

export default ReviewSection;