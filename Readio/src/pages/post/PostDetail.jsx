import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import book1 from '../../assets/book1.jpg';
// import postBeLike from '../../assets/postBeLike.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailReviewIcon from '../../assets/postDetailReview.png';
// import postLike from '../../assets/postLike.png';
import defaultImg from '../../assets/defaultImg.png';

import PostCSS from './Post.module.css';
import { callPostDetailAPI, apiReportPost, callPostDeleteAPI } from '../../apis/PostAPICalls';
import { apiFollowUser, apiUnfollowUser, apiIsFollowingStatus } from '../../apis/FollowAPICalls';
import { apiGetPostLikeInfo } from '../../apis/PostLikeAPICalls';
import LikeButton from '../../components/postlike/PostLikeButton';
import PostOptionsMenu from '../../components/postoptions/PostOptionsMenu';
import ReviewSection from './PostReview';

function PostDetail() {
    const [loggedInUserProfile, setLoggedInUserProfile] = useState(null);
    

    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const postId = params.postId ? parseInt(params.postId) : null;
    const detailsRef = useRef(null);

    const post = useSelector(state => state.postReducer.postDetail);
    const followState = useSelector(state => state.followReducer);

    const authorProfileObject = post?.profileId;
    const postAuthorProfileId = authorProfileObject?.profileId;
    const loggedInUserSystemId = localStorage.getItem("userId");
    const currentActualProfileId = loggedInUserProfile?.profileId;

    const isFollowing = postAuthorProfileId && followState && followState.targetProfileId === postAuthorProfileId
        ? followState.isFollowing
        : false;

    const isPostOwner = currentActualProfileId && postAuthorProfileId && currentActualProfileId === postAuthorProfileId;
        
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
                    const token = sessionStorage.getItem("accessToken");
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

    // --- 게시물 상세 관련 useEffect ---
    useEffect(() => {
        const isLoggedIn = !!localStorage.getItem("accessToken");

        if (postId) { // postId가 유효한 경우
            // 게시물 상세 정보 로드 (기존 로직)
            console.log('[useEffect @PostDetail] Dispatching callPostDetailAPI for postId:', postId);
            dispatch(callPostDetailAPI({ postId: postId })); // params.postId 대신 이미 변환된 postId 사용

            if (isLoggedIn) {
                if (typeof apiGetPostLikeInfo === 'function') {
                    dispatch(apiGetPostLikeInfo(postId)); 
                } else {
                    console.error('[useEffect @PostDetail] apiGetPostLikeInfo is NOT a function! Check import path or export in LikeAPICalls.js');
                }
            } else {
                console.log('[useEffect @PostDetail] Not logged in, SKIPPING user-specific apiGetPostLikeInfo. Consider fetching public like count if available.');
            }
        } else {
            console.log('[useEffect @PostDetail] No postId, SKIPPING API calls.');
        }
    }, [dispatch, postId]); // postId가 변경될 때마다 이 useEffect가 재실행됩니다.


    // --- 초기 팔로우 상태 확인 useEffect ---
    useEffect(() => {
        // currentActualProfileId와 postAuthorProfileId가 모두 유효하고, 서로 다를 때만 API 호출
        if (currentActualProfileId && postAuthorProfileId && currentActualProfileId !== postAuthorProfileId) {
            dispatch(apiIsFollowingStatus(postAuthorProfileId));
        } else if (currentActualProfileId && postAuthorProfileId && currentActualProfileId === postAuthorProfileId) {
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

    

    // --- 옵션 메뉴 핸들러 ---
    const handleEditPost = () => {
        console.log("수정하기 클릭됨 - postId:", postId);
        navigate(`/mylibrary/post/edit/${postId}`); // 실제 수정 페이지로 이동 로직
    };

    const handleDeletePost = () => {
        if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
            console.log("삭제하기 클릭됨 - postId:", postId);
            dispatch(callPostDeleteAPI(postId)).then(() => navigate('/')); // 실제 삭제 API 호출
        }
    };

    const handleReportPost = async (postId) => {
        if (!window.confirm("이 게시물을 신고하시겠습니까?")) {
            return;
        }

        try {
            const result = dispatch(apiReportPost(postId));
            alert('게시물이 성공적으로 신고되었습니다.');
            console.log('신고 성공:', result);
        } catch (error) {
            console.error('게시물 신고 실패:', error);
            alert('게시물 신고에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
        }
    };

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
                    {post && postId && (
                        <PostOptionsMenu
                            postId={postId}
                            isPostOwner={isPostOwner}
                            loggedInUserId={loggedInUserSystemId}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            onReport={handleReportPost}
                        />
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