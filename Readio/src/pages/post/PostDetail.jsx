import { useEffect, useRef, useState } from 'react';
import book1 from '../../assets/book1.jpg';
import postBeLike from '../../assets/postBeLike.png';
import postContentImg from '../../assets/postContentImg.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReview from '../../assets/postDetailReview.png';
import postLike from '../../assets/postLike.png';
import profileImg1 from '../../assets/profileImg1.png';
import profileImg2 from '../../assets/profileImg2.png';
import profileImg3 from '../../assets/profileImg3.png';
import PostCSS from './Post.module.css';


function PostDetail () {

    const [isFollowing, setIsFollowing] = useState(false);
    const [likeTab, setLikeTab] = useState(false);

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    const detailsRef = useRef(null);

    useEffect (() => {
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

    const toggleLike = () => {
        setLikeTab(prevLikeTab => typeof prevLikeTab === 'string' ? true : !prevLikeTab);
    };

    // const isLikedBoolean = typeof likeTab === 'string' ? false : likeTab;


    return (
        <div className={PostCSS.postDetailDiv}>
            <div className={PostCSS.postProfileDiv}>
                <img src={profileImg1} className={PostCSS.postProfileIcon}/>
                <div className={PostCSS.postProfile}>
                    <li>토리_tory</li>
                    <li>2025.4.29</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button className={`${PostCSS.postDetailLikebt} ${likeTab ? postBeLike : postLike}`}
                    onClick={toggleLike}>
                        <img src={likeTab ? postLike : postBeLike} className={PostCSS.postDetailLike} alt="like button"/>
                    </button>
                    <button className={`${PostCSS.postDetailFollwbt} ${isFollowing ? PostCSS.followingBt : ''}`}
                    onClick={toggleFollow}>
                        {isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                    <details ref={detailsRef} style={{position:'relative', display:'inline-block'}}>
                        <summary className={PostCSS.postDetailOptionbt}>
                            <img src={postDetailOption} alt="옵션 더보기" className={PostCSS.postDetailOption}/>
                        </summary>
                        <div className={PostCSS.postOptionList}>
                            <p className={PostCSS.postOptionModify}>수정하기</p>
                            <p className={PostCSS.postOptionDelete}>삭제하기</p>
                        </div>
                    </details>
                </div>
            </div> 
            <h2 className={PostCSS.postDetailTitle}>진짜 생존 신고</h2>
            <div className={PostCSS.postDetailContent}>어우 학교 못갈수도 있어요<br/>
            <br/>
            저 지금 영랑호 리조트라는 숙소에 있는데.. 안전안내문자가 보통 주변에 있는 곳에서 오잖아요? 고성군에서 불났다네요.. 네이버 cctv 보니까 올때 지났던 기린터널.. 간격이 좁아 터널과 터널사이 어떤 곳에 유리로 조치 해논걸로 아는데 거기 기억나거든요 근데 거기 불났어요 ㄷㄷ 진짜 남의 일이라 생각했는데 보니까 인제에서 양양 건너 속초에요.. 산이랑 산사이에 도시 장벽이 있긴 한데 무서워요.. 여기 주변 숲이라;; 지금 숙소 버리고 도망가도 국도로 돌아서 가야 하고요 망했어요</div>
            <img src={postContentImg} className={PostCSS.postContentImg}/>
            <div className={PostCSS.postDetailHeartDiv}>
                <span className={PostCSS.postDetailHeartSpan}><img src={postDetailHeart} className={PostCSS.postDetailHeart}/>15</span>
                <span className={PostCSS.postDetailHeartSpan}><img src={postDetailReview} className={PostCSS.postDetailReview}/>3</span>
            </div>
            <div className={PostCSS.postDetailBookDiv}>
                <img src={book1} className={PostCSS.postDetailBook}/>
                <div className={PostCSS.postDetailBookTitleDiv}>
                    <h3 className={PostCSS.postDetailBookTitle}>어린이를 위한 철학자의 말</h3>
                    <p className={PostCSS.postDetailBookTitle}>김종원 글 • 윌마</p>
                </div>
            </div>
            <div className={PostCSS.postDetailReviewDiv}>
                <div>
                    <p className={PostCSS.postDetailReviews}>댓글 3</p>
                </div>
                <div className={PostCSS.postDetailReviewProDiv}>
                    <img src={profileImg2} className={PostCSS.postDetailReviewIcon}/>
                    <div className={PostCSS.postDetailReviewProfile}>
                        <li>산과들</li>
                        <li>2025.4.29</li>
                    </div>
                </div>
                <p className={PostCSS.postDetailReviewcon}>최태성 선생님의 [최소한의 한국사] 추천합니다. 우리 역사를 쉽고 유익하게 접근해 볼 수 있어서 좋았습니다.</p>
                <div className={PostCSS.postDetailReviewLikeDiv}>
                    <p className={PostCSS.postDetailReviewLike}>좋아요 5</p>
                    <div className={PostCSS.postDetailReviewBtDiv}>
                        <button className={PostCSS.postDetailReviewBt}>수정</button>
                        <button className={PostCSS.postDetailReviewBt}>삭제</button>
                    </div>
                </div>
                                <div className={PostCSS.postDetailReviewProDiv}>
                    <img src={profileImg1} className={PostCSS.postDetailReviewIcon}/>
                    <div className={PostCSS.postDetailReviewProfile}>
                        <li>채길짜</li>
                        <li>2025.4.29</li>
                    </div>
                </div>
                <p className={PostCSS.postDetailReviewcon}>&lt;인생이라는 이름의 영화관&gt; 토론하기 좋은 인생책 추천합니다!'</p>
                <div className={PostCSS.postDetailReviewLikeDiv}>
                    <p className={PostCSS.postDetailReviewLike}>좋아요 5</p>
                    <div className={PostCSS.postDetailReviewBtDiv}>

                    </div>
                </div>
                                <div className={PostCSS.postDetailReviewProDiv}>
                    <img src={profileImg3} className={PostCSS.postDetailReviewIcon}/>
                    <div className={PostCSS.postDetailReviewProfile}>
                        <li>seohk322</li>
                        <li>2025.4.20</li>
                    </div>
                </div>
                <p className={PostCSS.postDetailReviewcon}>찬란한 멸종이라는 이정모 관장님이 쓰신 책이 있습니다. 늦었다고 생각할 대가 사실 제일 빠른법! 우리가 누리는 이 찬란함이 누군가의 찬란함으로 바뀌기 전에 지금 눈앞으로 다가온 무시무시한 기후변화에 대비할 마음가짐을 이책을 통해 길러보는 것은 어떨까여?</p>
                <div className={PostCSS.postDetailReviewLikeDiv}>
                    <p className={PostCSS.postDetailReviewLike}>좋아요 5</p>
                    <div className={PostCSS.postDetailReviewBtDiv}>
                    </div>
                </div>
                <div style={{textAlign : 'center'}}>
                    <p style={{fontSize : '15px'}}>1 | 2 | 3</p>
                </div>
                <div className={PostCSS.postDetailReviewReDiv}>
                    <input type="text"
                           name="postReview"
                           placeholder='댓글 입력'
                           className={PostCSS.postDetailReviewRe}/>
                    <button className={PostCSS.postDetailReviewReBt}>등록</button>
                </div>
            </div>
        </div>
    )
}

export default PostDetail;