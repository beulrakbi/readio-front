import PostListCSS from "./PostList.module.css"
import postDetailHeart from '../../../assets/postDetailHeart.png';
// import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReview from '../../../assets/postDetailReview.png';
import feedConImg from '../../../assets/feedConImg.png';
import book2 from '../../../assets/book2.png';
import { useState } from 'react';

function PostList () {

    const [activeTab, setActiveTab] = useState('post');

    return (
        <div className={PostListCSS.followDiv}>
            <button className={PostListCSS.followBackBt}>&lt; cOwsun</button>
            <div className={PostListCSS.followTapDiv}>
                <div className={PostListCSS.followListBtDiv}>
                    <button className={`${PostListCSS.followListBt} ${activeTab === 'post' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('post')}>
                            포스트 1
                    </button>
                </div>
                <div className={PostListCSS.followListBtDiv}>
                    <button className={`${PostListCSS.followListBt} ${activeTab === 'review' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('review')}>
                            리뷰 1
                    </button>
                </div>
            </div>
            {activeTab === 'post' ? (
                <div className={PostListCSS.postListDiv}>
                    <div className={PostListCSS.postListConDiv}>
                        <div className={PostListCSS.postListCon}>
                            <p>2025.4.27</p>
                            <h2>어른의 맞춤법</h2>
                            <p>읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다.</p>
                        </div>
                        <div className={PostListCSS.postListConImgDiv}>
                            <img src={feedConImg} className={PostListCSS.postListConImg}/>
                        </div>
                    </div>
                    <div className={PostListCSS.postListHeartDiv}>
                        <span className={PostListCSS.postListHeartSpan}><img src={postDetailHeart} className={PostListCSS.postListHeart}/>15</span>
                        <span className={PostListCSS.postListHeartSpan}><img src={postDetailReview} className={PostListCSS.postListReview}/>3</span>
                    </div>
                </div>
            ) : (
                <div className={PostListCSS.reviewListDiv}>
                    <div className={PostListCSS.reviewListBookDiv}>
                        <img src={book2} className={PostListCSS.reviewListBook}/>
                        <div>
                            <p className={PostListCSS.reviewListrating}>★★★★★</p>
                            <h3 className={PostListCSS.reviewListBookTitle}>신화급 마검 헌터 1권</h3>
                            <p className={PostListCSS.reviewListBookTitle}>태일 지음</p>
                        </div>
                    </div>
                    <div>
                        <p className={PostListCSS.reviewListDate}>2025.4.27</p>
                        <p className={PostListCSS.reviewListCon}>재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검....</p>
                    </div>
                    <div className={PostListCSS.postListHeartDiv}>
                        <span className={PostListCSS.postListHeartSpan}><img src={postDetailHeart} className={PostListCSS.postListHeart}/>15</span>
                        {/* <div className={PostListCSS.revieListBtDiv}>
                            <button className={PostListCSS.revieListBt}>수정</button>
                            <button className={PostListCSS.revieListBt}>삭제</button>
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostList