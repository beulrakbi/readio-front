import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import book1 from '../../assets/book1.jpg';
// import postBeLike from '../../assets/postBeLike.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReviewIcon from '../../assets/postDetailReview.png';
// import postLike from '../../assets/postLike.png';
import defaultImg from '../../assets/defaultImg.png';

import PostCSS from './Post.module.css';
import { callPostDetailAPI } from '../../apis/PostAPICalls';
import { apiFollowUser, apiUnfollowUser, apiIsFollowingStatus } from '../../apis/FollowAPICalls';
import LikeButton from '../../components/postlike/PostLikeButton';
import ReviewSection from './PostReview';

function PostDetail() {
    // const [isFollowing, setIsFollowing] = useState(false); // 로컬 상태 대신 Redux 사용
    // const [likeTab, setLikeTab] = useState(false);
    const [loggedInUserProfile, setLoggedInUserProfile] = useState(null);
    

    const dispatch = useDispatch();
    const params = useParams();
    const postId = params.postId ? parseInt(params.postId) : null;
    const detailsRef = useRef(null);

    const post = useSelector(state => state.postReducer);
    const followState = useSelector(state => state.followReducer);

    const authorProfileObject = post?.profileId;
    const postAuthorProfileId = authorProfileObject?.profileId;
    const loggedInUserSystemId = localStorage.getItem("userId");
    const currentActualProfileId = loggedInUserProfile?.profileId;

    const isFollowing = postAuthorProfileId && followState && followState.targetProfileId === postAuthorProfileId
        ? followState.isFollowing
        : false;

        console.log('[PostDetail] 최종 계산된 isFollowing:', isFollowing);

    console.log(JSON.stringify(post, null, 2));

    // --- 게시물 상세 관련 useEffect ---
    useEffect(() => {
        if (params.postId) {
            dispatch(callPostDetailAPI({
                postId: params.postId
            }));
        }
    }, [dispatch, params.postId]);

    // --- 로그인한 사용자 프로필 정보 로드 useEffect ---
    useEffect(() => {
        if (loggedInUserSystemId) {
            const fetchLoggedInUserProfile = async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    const response = await axios.get(`/api/user/profile/${loggedInUserSystemId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setLoggedInUserProfile(response.data); // response.data가 Profile 객체라고 가정
                } catch (error) {
                    console.error("로그인 사용자 프로필 조회 실패:", error);
                    setLoggedInUserProfile(null);
                }
            };
            fetchLoggedInUserProfile();
        } else {
            setLoggedInUserProfile(null);
        }
    }, [loggedInUserSystemId]);

    // --- 초기 팔로우 상태 확인 useEffect ---
    useEffect(() => {
        // currentActualProfileId와 postAuthorProfileId가 모두 유효하고, 서로 다를 때만 API 호출
        if (currentActualProfileId && postAuthorProfileId && currentActualProfileId !== postAuthorProfileId) {
            dispatch(apiIsFollowingStatus(postAuthorProfileId));
        } else if (currentActualProfileId && postAuthorProfileId && currentActualProfileId === postAuthorProfileId) {
            // 자신의 게시물인 경우의 로직 (필요하다면 Redux 상태를 '팔로우 안함'으로 명시적 설정 등)
            // console.log("자신의 게시물입니다. 팔로우 상태 확인 API를 호출하지 않습니다.");
        }
    }, [dispatch, currentActualProfileId, postAuthorProfileId]);

    // --- 옵션 메뉴 외부 클릭 시 닫기 useEffect ---
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

    // --- 데이터 로딩 중 UI ---
    if (!post || !post.postId) {
        return <p>데이터를 불러오는 중입니다...</p>;
    }

    // --- 이벤트 핸들러 ---
    const toggleFollow = async () => {
        if (!currentActualProfileId || !postAuthorProfileId || currentActualProfileId === postAuthorProfileId) {
            alert("팔로우 기능을 사용할 수 없습니다. (로그인 상태 또는 대상 확인)");
            return;
        }

        if (isFollowing) {
            dispatch(apiUnfollowUser(postAuthorProfileId));
        } else {
            dispatch(apiFollowUser({ followingProfileId: postAuthorProfileId }, postAuthorProfileId));
        }
    };

    // --- 렌더링에 필요한 변수들 ---
    const authorNickname = authorProfileObject?.penName || "작성자";
    const authorProfileImg = authorProfileObject?.imageUrl || defaultImg;
    const isPostOwner = currentActualProfileId && postAuthorProfileId && currentActualProfileId === postAuthorProfileId;

    return (
        <div className={PostCSS.postDetailDiv}>
            <div className={PostCSS.postProfileDiv}>
                <img src={authorProfileImg} className={PostCSS.postProfileIcon} alt="프로필" />
                <div className={PostCSS.postProfile}>
                    <li>{authorNickname}</li>
                    <li>{post.postCreatedDate || ''}</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    {postId && <LikeButton postId={postId} />}
                    {loggedInUserSystemId && !isPostOwner && (
                        <button
                            className={`${PostCSS.postDetailFollwbt} ${isFollowing ? PostCSS.followingBt : ''}`}
                            onClick={toggleFollow}
                        >
                            {isFollowing ? '팔로잉' : '팔로우'}
                        </button>
                    )}
                    {loggedInUserSystemId && isPostOwner && (
                        <button className={PostCSS.postDetailFollwbt} disabled style={{ cursor: 'default' }}>
                            내 게시물
                        </button>
                    )}
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
            <div className={PostCSS.postDetailContent}>
                {post.postContent || ''}<br />
            </div>

            {post.postImg && post.postImg.saveName &&
                <img src={post.postImg.saveName} className={PostCSS.postContentImg} alt="게시물 이미지" />
            }

            <div className={PostCSS.postDetailHeartDiv}>
                <span className={PostCSS.postDetailHeartSpan}>
                    <img src={postDetailHeart} className={PostCSS.postDetailHeart} alt="좋아요 수" />15
                </span>
                <span className={PostCSS.postDetailHeartSpan}>
                    <img src={postDetailReviewIcon} className={PostCSS.postDetailReview} alt="리뷰 수" />
                    {post.reviewCount || 0}
                </span>
            </div>

            {post.bookDetails && (
                <div className={PostCSS.postDetailBookDiv}>
                    <img src={post.bookDetails.coverUrl || book1} className={PostCSS.postDetailBook} alt="책 표지" />
                    <div className={PostCSS.postDetailBookTitleDiv}>
                        <h3 className={PostCSS.postDetailBookTitle}>{post.bookDetails.title || '책 제목 없음'}</h3>
                        <p className={PostCSS.postDetailBookTitle}>
                            {post.bookDetails.author || '저자 정보 없음'} • {post.bookDetails.publisher || '출판사 정보 없음'}
                        </p>
                    </div>
                </div>
            )}

            {params.postId && <ReviewSection postId={params.postId} />}
        </div>
    );
}

export default PostDetail;