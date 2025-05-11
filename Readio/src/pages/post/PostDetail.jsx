import profileImg1 from '../../assets/profileImg1.png';
import profileImg2 from '../../assets/profileImg2.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postLike from '../../assets/postLike.png';
import postContentImg from '../../assets/postContentImg.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailReview from '../../assets/postDetailReview.png';
import book1 from '../../assets/book1.jpg';
import PostCSS from './Post.module.css';

function PostDetail () {
    return (
        <div className={PostCSS.postDetailDiv}>
            <div className={PostCSS.postProfileDiv}>
                <img src={profileImg1} className={PostCSS.postProfileIcon}/>
                <div className={PostCSS.postProfile}>
                    <li>토리_tory</li>
                    <li>2025.4.29</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button className={PostCSS.postDetailLikebt}>
                        <img src={postLike} className={PostCSS.postDetailLike}/>
                    </button>
                    <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                    <button className={PostCSS.postDetailOptionbt}>
                        <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                    </button>
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
            <div>
                <div>
                    <p>댓글 3</p>
                </div>
                <div>
                    <img src={profileImg2}/>
                    <div>
                        <li>산과들</li>
                        <li>2025.4.29</li>
                    </div>
                    <p>최태성 선생님의 [최소한의 한국사] 추천합니다. 우리 역사를 쉽고 유익하게 접근해 볼 수 있어서 좋았습니다.</p>
                    <div>
                        <p>좋아요 5</p>
                        <button>수정</button>
                        <button>삭제</button>
                    </div>
                    <div>
                        <input type="text" name="postReview" placeholder='댓글 입력'/>
                        <button>등록</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetail;