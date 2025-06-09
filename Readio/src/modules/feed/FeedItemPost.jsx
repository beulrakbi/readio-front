import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedCSS from '../../pages/Feed/Feed.module.css';
import PostCSS from '../../pages/post/Post.module.css';
import PostOptionsMenu from '../../components/postoptions/PostOptionsMenu';

// assets 경로 수정
import postBeLike from '../../assets/postBeLike.png';
import defaultImg from '../../assets/defaultImg.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReview from '../../assets/postDetailReview.png';
import postLike from '../../assets/postLike.png';

const BASE_IMAGE_URL = 'http://localhost:8080/img/';

function FeedItemPost({ item, loggedInUserId, onToggleLike, onToggleFollow, onReport }) {
    // const detailsRef = useRef(null);
    const navigate = useNavigate();

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

    // 날짜/시간 포맷팅 함수
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const handleContentClick = () => {
        navigate(`/mylibrary/post/${item.id}`);
    };

    const handleProfileClick = () => {
        if(item && item.profileId) navigate(`/mylibrary/${item.userId}`);
    }

    const isPostOwner = !!(loggedInUserId && item.authorId && String(item.authorId) === String(loggedInUserId));

    const handleReport = (postId) => onReport(postId, 'post');

    return (
        <div className={FeedCSS.feedContentDiv}>
            <div className={FeedCSS.feedPostProfileDiv}>
                <img src={item.profileImg ? `${BASE_IMAGE_URL}profile/${item.profileImg}` : defaultImg} className={FeedCSS.feedPostProfileImg} alt="profile" onClick={handleProfileClick} />
                <div className={FeedCSS.feedPostProfile}>
                    <li>{item.userName}</li>
                    <li>{formatDateTime(item.createdAt)}</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button
                        className={`${PostCSS.postDetailLikebt}`}
                        onClick={() => onToggleLike(item.id)}
                    >
                        <img src={item.isLiked ? postLike : postBeLike} className={PostCSS.postDetailLike} alt="like button" />
                    </button>
                    {!isPostOwner && loggedInUserId && (
                        <button
                            className={`${PostCSS.postDetailFollwbt} ${item.isFollowing ? PostCSS.followingBt : ''}`}
                            onClick={() => onToggleFollow(item.authorId)}
                        >
                            {item.isFollowing ? '팔로잉' : '팔로우'}
                        </button>
                    )}
                    <PostOptionsMenu
                        postId={item.id}
                        isPostOwner={isPostOwner}
                        loggedInUserId={loggedInUserId}
                        // onEdit, onDelete는 전달하지 않음
                        onReport={onReport ? handleReport : undefined}
                    />
                </div>
            </div>
            <div className={FeedCSS.feedPostConDiv} onClick={handleContentClick}>
                <div className={FeedCSS.feedPostCon}>
                    <h2>{item.title}</h2>
                    <p>{item.content}</p>
                </div>
                {item.contentImg && (
                    <div className={FeedCSS.feedPostConImgDiv}>
                        <img src={`${BASE_IMAGE_URL}${item.contentImg}`} className={FeedCSS.feedPostConImg} alt="content" />
                    </div>
                )}
            </div>
            <div className={FeedCSS.feedPostHeartDiv}>
                <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailHeart} className={FeedCSS.feedPostHeart} alt="heart icon"/>{item.likesCount}</span>
                <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailReview} className={FeedCSS.feedPostReview} alt="review icon"/>{item.reviewsCount}</span>
            </div>
        </div>
    );
}

export default FeedItemPost;