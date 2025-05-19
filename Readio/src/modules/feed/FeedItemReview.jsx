import { useEffect, useRef } from 'react';
import postBeLike from '../../assets/postBeLike.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postLike from '../../assets/postLike.png';
import FeedCSS from '../../pages/Feed/Feed.module.css';
import PostCSS from '../../pages/post/Post.module.css';

function FeedItemReview(props) {
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
            <div className={FeedCSS.feedReConDiv}>
                <p className={FeedCSS.feedReCon}>{props.reviewText}</p>
            </div>
            <div className={FeedCSS.feedReBookDiv}>
                <img src={props.bookImg} className={FeedCSS.feedReBook} alt="book cover"/>
                <div className={FeedCSS.feedReBookTitleDiv}>
                    <h3 className={FeedCSS.feedReBookTitle}>{props.bookTitle}</h3>
                    <p className={FeedCSS.feedReBookTitle}>{props.bookAuthor}</p>
                </div>
            </div>
        </div>
    );
}

export default FeedItemReview;