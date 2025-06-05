import { useEffect, useRef } from 'react';
import postBeLike from '../../assets/postBeLike.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailReview from '../../assets/postDetailReview.png';
import postLike from '../../assets/postLike.png';
import FeedCSS from '../../pages/Feed/Feed.module.css';
import PostCSS from '../../pages/post/Post.module.css';

function FeedItemReview({ item, onToggleLike, onToggleFollow, onReport }) {
    const detailsRef = useRef(null);

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

    return (
        <div className={FeedCSS.feedContentDiv}>
            <div className={FeedCSS.feedPostProfileDiv}>
                <img src={item.profileImg} className={FeedCSS.feedPostProfileImg} alt="profile" />
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
                    <button
                        className={`${PostCSS.postDetailFollwbt} ${item.isFollowing ? PostCSS.followingBt : ''}`}
                        onClick={onToggleFollow}
                    >
                        {item.isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                    <details ref={detailsRef} style={{ position: 'relative', display: 'inline-block' }}>
                        <summary className={PostCSS.postDetailOptionbt}>
                            <img src={postDetailOption} alt="옵션 더보기" className={PostCSS.postDetailOption} />
                        </summary>
                        <div className={PostCSS.postDetailList}>
                            <p onClick={() => onReport(item.id, item.type, 'reason')}>신고하기</p>
                        </div>
                    </details>
                </div>
            </div>
            <div className={FeedCSS.feedReConDiv}>
                <p className={FeedCSS.feedReCon}>{item.reviewContent}</p>
            </div>
            <div className={FeedCSS.feedReBookDiv}>
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