import { useEffect, useRef, useState } from 'react';
import book1 from '../../assets/book1.jpg';
import postBeLike from '../../assets/postBeLike.png';

import axios from 'axios';

import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReviewIcon from '../../assets/postDetailReview.png';
import postLike from '../../assets/postLike.png';
import defaultImg from '../../assets/defaultImg.png';

import PostCSS from './Post.module.css';
import { useParams } from 'react-router-dom';
import { callPostDetailAPI } from '../../apis/PostAPICalls';
import { useDispatch, useSelector } from 'react-redux';

import ReviewSection from './PostReview';

function PostDetail() {
    const [isFollowing, setIsFollowing] = useState(false);
    const [likeTab, setLikeTab] = useState(false);
    const [loggedInUserProfile, setLoggedInUserProfile] = useState(null);

    const dispatch = useDispatch();
    const params = useParams();
    const detailsRef = useRef(null);

    const post = useSelector(state => state.postReducer); 

    console.log(JSON.stringify(post, null, 2))
                                                        
    const loggedInUserSystemId = localStorage.getItem("userId");

    // --- 게시물 상세 관련 useEffect ---
    useEffect(() => {
        if (params.postId) {
            dispatch(callPostDetailAPI({
                postId: params.postId
            }));
        }
    }, [dispatch, params.postId]); // 의존성 배열 추가

    useEffect(() => {
        if (loggedInUserSystemId) {
            const fetchLoggedInUserProfile = async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    // 이 API는 loggedInUserSystemId(User ID)를 기반으로
                    // Profile 정보(profileId 포함)를 반환해야 합니다.
                    const response = await axios.get(`/api/user/profile/${loggedInUserSystemId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setLoggedInUserProfile(response.data); // response.data에 profileId, nickname 등이 있어야 함
                } catch (error) {
                    console.error("로그인 사용자 프로필 조회 실패:", error);
                    setLoggedInUserProfile(null);
                }
            };
            fetchLoggedInUserProfile();
        } else {
            setLoggedInUserProfile(null); // 로그인하지 않은 경우
        }
    }, [loggedInUserSystemId]);

    const authorProfileObject = post.profileId;
    const postAuthorProfileId = authorProfileObject?.profileId;
    const currentActualProfileId = loggedInUserProfile?.profileId;

     // --- 초기 팔로우 상태 확인 useEffect ---
    useEffect(() => {
        if (currentActualProfileId && postAuthorProfileId && currentActualProfileId !== postAuthorProfileId) {
            const checkFollowStatus = async () => {
                try {
                    const response = await apiIsFollowingStatus(postAuthorProfileId);
                    if (response && typeof response.isFollowing === 'boolean') {
                        setIsFollowing(response.isFollowing);
                    }
                } catch (error) {
                    console.error("팔로우 상태 확인 실패:", error);
                }
            };
            checkFollowStatus();
        } else if (currentActualProfileId && postAuthorProfileId && currentActualProfileId === postAuthorProfileId) {
            setIsFollowing(false);
        }
    }, [currentActualProfileId, postAuthorProfileId]);

    useEffect(() => {
        const handleClickOut = (event) => {
            if (detailsRef.current && detailsRef.current.open && !detailsRef.current.contains(event.target)) {
                detailsRef.current.open = false;
            }
        };
        document.addEventListener('mousedown', handleClickOut);
        return () => {
            document.removeEventListener('mousedown', handleClickOut);
        };
    }, []); 


    if (!post || !post.postId) { 
        return <p>데이터를 불러오는 중입니다...</p>;
    }

    // --- 게시물 상세 관련 핸들러 ---
    const toggleFollow = async () => {
        // 로그인하지 않았거나, 작성자 정보가 없거나, 자신의 게시물인 경우 동작 안 함
        if (!currentUserId || !postAuthorProfileId || currentUserId === postAuthorProfileId) {
            alert("팔로우 기능을 사용할 수 없습니다."); // 또는 다른 UI 피드백
            return;
        }

        try {
            if (isFollowing) { // 현재 팔로잉 중 -> 언팔로우 실행
                await apiUnfollowUser(postAuthorProfileId); // 언팔로우할 대상의 ID 전달
                setIsFollowing(false);
                // 성공 알림 또는 UI 업데이트
            } else { // 현재 팔로우 안 함 -> 팔로우 실행
                await apiFollowUser({ followingProfileId: postAuthorProfileId }); // 팔로우할 대상의 ID를 DTO에 담아 전달
                setIsFollowing(true);
                // 성공 알림 또는 UI 업데이트
            }
        } catch (error) {
            console.error("팔로우/언팔로우 처리 실패:", error);
            alert("요청 처리 중 오류가 발생했습니다."); // 사용자에게 에러 알림
            // UI를 이전 상태로 되돌릴 수도 있음 (선택적)
        }
    };

    const toggleLike = () => {
        setLikeTab(prevLikeTab => typeof prevLikeTab === 'string' ? true : !prevLikeTab);
    };

    const authorNickname = authorProfileObject?.penName || "작성자";
    const authorProfileImg = authorProfileObject?.imageUrl || defaultImg; // 기본 이미지 사용
    const isPostOwner = currentActualProfileId && postAuthorProfileId && currentActualProfileId === postAuthorProfileId;


    return (
        <div className={PostCSS.postDetailDiv}>
            <div className={PostCSS.postProfileDiv}>
                <img src={authorProfileImg} className={PostCSS.postProfileIcon} alt="프로필"/>
                <div className={PostCSS.postProfile}>
                    <li>{authorNickname}</li> 
                    <li>{post.postCreatedDate || ''}</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button className={`${PostCSS.postDetailLikebt} ${likeTab ? PostCSS.liked : ''}`}
                        onClick={toggleLike}>
                        <img src={likeTab ? postBeLike : postLike} className={PostCSS.postDetailLike} alt="like button" />
                    </button>
                    {/* 팔로우 버튼: 자신의 게시물이 아닐 때만 보이도록 조건부 렌더링 */}
                    {loggedInUserSystemId && !isPostOwner && (
                        <button
                            className={`${PostCSS.postDetailFollwbt} ${isFollowing ? PostCSS.followingBt : ''}`}
                            onClick={toggleFollow}
                        >
                            {isFollowing ? '팔로잉' : '팔로우'}
                        </button>
                    )}
                    {/* 자신의 게시물일 경우 버튼을 다르게 표시하거나 숨길 수 있음 */}
                    {loggedInUserSystemId && isPostOwner && (
                         <button className={PostCSS.postDetailFollwbt} disabled style={{cursor: 'default'}}></button>
                    )}

                    {/* 옵션 버튼 (수정/삭제 - 권한 확인 로직 필요) */}
                    {/* 현재 사용자가 게시물 작성자인 경우에만 보이도록 조건 추가 필요 */}
                    {loggedInUserSystemId && isPostOwner && (
                        <details ref={detailsRef} style={{ position: 'relative', display: 'inline-block' }}>
                            <summary className={PostCSS.postDetailOptionbt}>
                                <img src={postDetailOption} alt="옵션 더보기" className={PostCSS.postDetailOption} />
                            </summary>
                            <div className={PostCSS.postOptionList}>
                                <p className={PostCSS.postOptionModify}>수정하기</p>
                                <p className={PostCSS.postOptionDelete}>삭제하기</p>
                            </div>
                        </details>
                    )}
                </div>
            </div>
            <h2 className={PostCSS.postDetailTitle}>{post.postTitle || ''}</h2>
            <div className={PostCSS.postDetailContent}>{post.postContent || ''}<br />
            </div>
            {post.postImg && post.postImg.saveName &&
                <img src={post.postImg.saveName} className={PostCSS.postContentImg} />
            }
            <div className={PostCSS.postDetailHeartDiv}>
                <span className={PostCSS.postDetailHeartSpan}><img src={postDetailHeart} className={PostCSS.postDetailHeart} alt="좋아요 수" />15</span>
                <span className={PostCSS.postDetailHeartSpan}><img src={postDetailReviewIcon} className={PostCSS.postDetailReview} alt="리뷰 수" />3</span>
            </div>
            {post.bookDetails && (
                 <div className={PostCSS.postDetailBookDiv}>
                    <img src={post.bookDetails.coverUrl || book1} className={PostCSS.postDetailBook} alt="책 표지"/>
                    <div className={PostCSS.postDetailBookTitleDiv}>
                        <h3 className={PostCSS.postDetailBookTitle}>{post.bookDetails.title || '책 제목 없음'}</h3>
                        <p className={PostCSS.postDetailBookTitle}>{post.bookDetails.author || '저자 정보 없음'} • {post.bookDetails.publisher || '출판사 정보 없음'}</p>
                    </div>
                </div>
            )}

            {/* 분리된 리뷰 섹션 컴포넌트 호출 */}
            {/* postId를 props로 전달합니다. params.postId가 확실히 존재할 때 전달합니다. */}
            {params.postId && <ReviewSection postId={params.postId} />}
        </div>
    );
}

export default PostDetail;