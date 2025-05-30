import { useEffect, useRef, useState } from 'react';
import book1 from '../../assets/book1.jpg';
import postBeLike from '../../assets/postBeLike.png';

import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReviewIcon from '../../assets/postDetailReview.png';
import postLike from '../../assets/postLike.png';
import profileImg1 from '../../assets/profileImg1.png';

import PostCSS from './Post.module.css';
import { useParams } from 'react-router-dom';
import { callPostDetailAPI } from '../../apis/PostAPICalls';
import { useDispatch, useSelector } from 'react-redux';

import ReviewSection from './PostReview';

function PostDetail() {
    const [isFollowing, setIsFollowing] = useState(false);
    const [likeTab, setLikeTab] = useState(false);

    const dispatch = useDispatch();
    const params = useParams();
    const post = useSelector(state => state.postReducer); 
                                                        
    const detailsRef = useRef(null);

    // --- 게시물 상세 관련 useEffect ---
    useEffect(() => {
        if (params.postId) {
            dispatch(callPostDetailAPI({
                postId: params.postId
            }));
        }
    }, [dispatch, params.postId]); // 의존성 배열 추가

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
    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    const toggleLike = () => {
        setLikeTab(prevLikeTab => typeof prevLikeTab === 'string' ? true : !prevLikeTab);
    };

    return (
        <div className={PostCSS.postDetailDiv}>
            <div className={PostCSS.postProfileDiv}>
                <img src={profileImg1} className={PostCSS.postProfileIcon} alt="프로필"/>
                <div className={PostCSS.postProfile}>
                    <li>토리_tory</li> 
                    <li>2025.4.29</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button className={`${PostCSS.postDetailLikebt} ${likeTab ? PostCSS.liked : ''}`}
                        onClick={toggleLike}>
                        <img src={likeTab ? postBeLike : postLike} className={PostCSS.postDetailLike} alt="like button" />
                    </button>
                    <button className={`${PostCSS.postDetailFollwbt} ${isFollowing ? PostCSS.followingBt : ''}`}
                        onClick={toggleFollow}>
                        {isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                    <details ref={detailsRef} style={{ position: 'relative', display: 'inline-block' }}>
                        <summary className={PostCSS.postDetailOptionbt}>
                            <img src={postDetailOption} alt="옵션 더보기" className={PostCSS.postDetailOption} />
                        </summary>
                        <div className={PostCSS.postOptionList}>
                            <p className={PostCSS.postOptionModify}>수정하기</p>
                            <p className={PostCSS.postOptionDelete}>삭제하기</p>
                        </div>
                    </details>
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
            <div className={PostCSS.postDetailBookDiv}>
                <img src={book1} className={PostCSS.postDetailBook} alt="책 표지"/>
                <div className={PostCSS.postDetailBookTitleDiv}>
                    <h3 className={PostCSS.postDetailBookTitle}>어린이를 위한 철학자의 말</h3>
                    <p className={PostCSS.postDetailBookTitle}>김종원 글 • 윌마</p>
                </div>
            </div>

            {/* 분리된 리뷰 섹션 컴포넌트 호출 */}
            {/* postId를 props로 전달합니다. params.postId가 확실히 존재할 때 전달합니다. */}
            {params.postId && <ReviewSection postId={params.postId} />}
        </div>
    );
}

export default PostDetail;