import { useEffect, useRef } from 'react';
import FeedCSS from '../../pages/Feed/Feed.module.css';
import PostCSS from '../../pages/post/Post.module.css';

// assets 경로 수정
import postBeLike from '../../assets/postBeLike.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReview from '../../assets/postDetailReview.png';
import postLike from '../../assets/postLike.png';

function FeedItemPost(props) {
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

    return (
        <div className={FeedCSS.feedContentDiv}>
            <div className={FeedCSS.feedPostProfileDiv}>
                <img src={props.profileImg} className={FeedCSS.feedPostProfileImg} alt="profile" />
                <div className={FeedCSS.feedPostProfile}>
                    <li>{props.userName}</li>
                    <li>{props.postMeta}</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button
                        className={`${PostCSS.postDetailLikebt}`}
                        onClick={props.onToggleLike}
                    >
                        <img src={props.isLikedProp ? postLike : postBeLike} className={PostCSS.postDetailLike} alt="like button" />
                    </button>
                    <button
                        className={`${PostCSS.postDetailFollwbt} ${props.isFollowingProp ? PostCSS.followingBt : ''}`}
                        onClick={props.onToggleFollow}
                    >
                        {props.isFollowingProp ? '팔로잉' : '팔로우'}
                    </button>
                    <details ref={detailsRef} style={{ position: 'relative', display: 'inline-block' }}>
                        <summary className={PostCSS.postDetailOptionbt}>
                            <img src={postDetailOption} alt="옵션 더보기" className={PostCSS.postDetailOption} />
                        </summary>
                        <div className={PostCSS.postDetailList}>
                            <p>신고하기</p>
                        </div>
                    </details>
                </div>
            </div>
            <div className={FeedCSS.feedPostConDiv}>
                <div className={FeedCSS.feedPostCon}>
                    <h2>{props.title}</h2>
                    <p>{props.text}</p>
                </div>
                {props.contentImg && (
                    <div className={FeedCSS.feedPostConImgDiv}>
                        <img src={props.contentImg} className={FeedCSS.feedPostConImg} alt="content" />
                    </div>
                )}
            </div>
            <div className={FeedCSS.feedPostHeartDiv}>
                <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailHeart} className={FeedCSS.feedPostHeart} alt="heart icon"/>{props.likesCount}</span>
                <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailReview} className={FeedCSS.feedPostReview} alt="review icon"/>{props.reviewsCount}</span>
            </div>
        </div>
    );
}

export default FeedItemPost;