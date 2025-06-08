import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import postBeLike from '../../assets/postBeLike.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import PostOptionsMenu from '../../components/postoptions/PostOptionsMenu';
import defaultImg from '../../assets/defaultImg.png';
import postLike from '../../assets/postLike.png';
import FeedCSS from '../../pages/Feed/Feed.module.css';
import PostCSS from '../../pages/post/Post.module.css';

const BASE_IMAGE_URL = 'http://localhost:8080/img/';

function FeedItemReview({ item, loggedInUserId, onToggleLike, onToggleFollow, onReport }) {
    // const detailsRef = useRef(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const handleClickOut = (event) => {
    //         if (detailsRef.current && detailsRef.current.open && !detailsRef.current.contains(event.target)) {
    //             detailsRef.current.open = false;
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOut);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOut);
    //     };
    // }, []);

    // 날짜/시간 포맷팅 함수
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const handleProfileClick = () => {
        if(item && item.profileId) navigate(`/mylibrary/${item.profileId}`);
    }

    const handleContentClick = () => {
        if(item && item.bookIsbn) navigate(`/bookPage/${item.bookIsbn}`);
    };

    const isPostOwner = !!(loggedInUserId && item.profileId && String(item.profileId) === String(loggedInUserId));

    const handleReport = (postId) => onReport(postId, 'review');

    return (
        <div className={FeedCSS.feedContentDiv}>
            <div className={FeedCSS.feedPostProfileDiv}>
                <img src={item.profileImg ? `${BASE_IMAGE_URL}profile/${item.profileImg}` : defaultImg} className={FeedCSS.feedPostProfileImg} alt="profile"
                        onClick={handleProfileClick} />
                <div className={FeedCSS.feedPostProfile}>
                    <li>{item.userName}</li>
                    <li>{formatDateTime(item.createdAt)}</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button
                        className={`${PostCSS.postDetailLikebt}`}
                        onClick={onToggleLike}
                    >
                        <img src={item.isLiked ? postLike : postBeLike} className={PostCSS.postDetailLike} alt="like button" />
                    </button>
                    {!isPostOwner && loggedInUserId && (
                        <button
                            className={`${PostCSS.postDetailFollwbt} ${item.isFollowing ? PostCSS.followingBt : ''}`}
                            onClick={onToggleFollow}
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
            <div className={FeedCSS.feedReConDiv}>
                <p className={FeedCSS.feedReCon}>{item.reviewContent}</p>
            </div>
            <div onClick={handleContentClick} className={FeedCSS.feedReBookDiv}>
                <img src={item.bookCoverUrl || book2} className={FeedCSS.feedReBook} alt="book cover"/>
                <div className={FeedCSS.feedReBookTitleDiv}>
                    <h3 className={FeedCSS.feedReBookTitle}>{item.bookTitle}</h3>
                    <p className={FeedCSS.feedReBookTitle}>{item.bookAuthor}</p>
                </div>
            </div>
            <div className={FeedCSS.feedPostHeartDiv}>
                <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailHeart} className={FeedCSS.feedPostHeart} alt="heart icon"/>{item.likesCount}</span>
            </div>
        </div>
    );
}

export default FeedItemReview;