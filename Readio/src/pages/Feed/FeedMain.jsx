import FeedRecWriting from '../../assets/FeedRecWriting.png';
import profileImg2 from '../../assets/profileImg2.png';
import profileImg3 from '../../assets/profileImg3.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailReview from '../../assets/postDetailReview.png';
import feedConImg from '../../assets/feedConImg.png';
import postBeLike from '../../assets/postBeLike.png';
import book2 from '../../assets/book2.png';
import FeedCSS from './Feed.module.css'
import PostCSS from '../post/Post.module.css'
import { useState } from 'react';

function FeedMain () {

    const [activeTab, setActiveTab] = useState('rec');
    const [subTab, setSubTab] = useState('all')

    const handleMainTabClick = (tabName) => {
        setActiveTab(tabName);
        setSubTab('all');
    };

    const renderRec = () => {
        if (subTab === 'all') {
            return (
                <>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg3} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>강적99</li>
                                <li>포스트 • 3분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostConDiv}>
                            <div className={FeedCSS.feedPostCon}>
                                <h2>어른의 맞춤법</h2>
                                <p>읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다.</p>
                            </div>
                            <div className={FeedCSS.feedPostConImgDiv}>
                                <img src={feedConImg} className={FeedCSS.feedPostConImg}/>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostHeartDiv}>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailHeart} className={FeedCSS.feedPostHeart}/>15</span>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailReview} className={FeedCSS.feedPostReview}/>3</span>
                        </div>
                    </div>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg2} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>배병</li>
                                <li>리뷰 • 5분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedReConDiv}>
                            <p className={FeedCSS.feedReCon}>재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검....</p>
                        </div>
                        <div className={FeedCSS.feedReBookDiv}>
                            <img src={book2} className={FeedCSS.feedReBook}/>
                            <div className={FeedCSS.feedReBookTitleDiv}>
                                <h3 className={FeedCSS.feedReBookTitle}>신화급 마검 헌터 1권</h3>
                                <p className={FeedCSS.feedReBookTitle}>태일 지음</p>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (subTab === 'post') {
            return (
                <>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg3} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>강적99</li>
                                <li>포스트 • 3분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostConDiv}>
                            <div className={FeedCSS.feedPostCon}>
                                <h2>어른의 맞춤법</h2>
                                <p>읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다.</p>
                            </div>
                            <div className={FeedCSS.feedPostConImgDiv}>
                                <img src={feedConImg} className={FeedCSS.feedPostConImg}/>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostHeartDiv}>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailHeart} className={FeedCSS.feedPostHeart}/>15</span>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailReview} className={FeedCSS.feedPostReview}/>3</span>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg2} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>배병</li>
                                <li>리뷰 • 5분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedReConDiv}>
                            <p className={FeedCSS.feedReCon}>재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검....</p>
                        </div>
                        <div className={FeedCSS.feedReBookDiv}>
                            <img src={book2} className={FeedCSS.feedReBook}/>
                            <div className={FeedCSS.feedReBookTitleDiv}>
                                <h3 className={FeedCSS.feedReBookTitle}>신화급 마검 헌터 1권</h3>
                                <p className={FeedCSS.feedReBookTitle}>태일 지음</p>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }

    const renderFollowing = () => {
        if (subTab === 'all') {
            return (
                <>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg3} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>강적99</li>
                                <li>포스트 • 3분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostConDiv}>
                            <div className={FeedCSS.feedPostCon}>
                                <h2>어른의 맞춤법</h2>
                                <p>읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다.</p>
                            </div>
                            <div className={FeedCSS.feedPostConImgDiv}>
                                <img src={feedConImg} className={FeedCSS.feedPostConImg}/>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostHeartDiv}>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailHeart} className={FeedCSS.feedPostHeart}/>15</span>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailReview} className={FeedCSS.feedPostReview}/>3</span>
                        </div>
                    </div>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg2} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>배병</li>
                                <li>리뷰 • 5분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedReConDiv}>
                            <p className={FeedCSS.feedReCon}>재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검....</p>
                        </div>
                        <div className={FeedCSS.feedReBookDiv}>
                            <img src={book2} className={FeedCSS.feedReBook}/>
                            <div className={FeedCSS.feedReBookTitleDiv}>
                                <h3 className={FeedCSS.feedReBookTitle}>신화급 마검 헌터 1권</h3>
                                <p className={FeedCSS.feedReBookTitle}>태일 지음</p>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (subTab === 'post') {
            return (
                <>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg3} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>강적99</li>
                                <li>포스트 • 3분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostConDiv}>
                            <div className={FeedCSS.feedPostCon}>
                                <h2>어른의 맞춤법</h2>
                                <p>읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다.</p>
                            </div>
                            <div className={FeedCSS.feedPostConImgDiv}>
                                <img src={feedConImg} className={FeedCSS.feedPostConImg}/>
                            </div>
                        </div>
                        <div className={FeedCSS.feedPostHeartDiv}>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailHeart} className={FeedCSS.feedPostHeart}/>15</span>
                            <span className={FeedCSS.feedPostHeartSpan}><img src={postDetailReview} className={FeedCSS.feedPostReview}/>3</span>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className={FeedCSS.feedContentDiv}>
                        <div className={FeedCSS.feedPostProfileDiv}>
                            <img src={profileImg2} className={FeedCSS.feedPostProfileImg} />
                            <div className={FeedCSS.feedPostProfile}>
                                <li>배병</li>
                                <li>리뷰 • 5분전</li>
                            </div>
                            <div className={PostCSS.postDetailBtDiv}>
                                <button className={PostCSS.postDetailLikebt}>
                                    <img src={postBeLike} className={PostCSS.postDetailLike}/>
                                </button>
                                <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                                <button className={PostCSS.postDetailOptionbt}>
                                    <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                                </button>
                            </div>
                        </div>
                        <div className={FeedCSS.feedReConDiv}>
                            <p className={FeedCSS.feedReCon}>재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검....</p>
                        </div>
                        <div className={FeedCSS.feedReBookDiv}>
                            <img src={book2} className={FeedCSS.feedReBook}/>
                            <div className={FeedCSS.feedReBookTitleDiv}>
                                <h3 className={FeedCSS.feedReBookTitle}>신화급 마검 헌터 1권</h3>
                                <p className={FeedCSS.feedReBookTitle}>태일 지음</p>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
    // const [isFollowing, setIsFollowing] = useState(false);

    // const toggleFollow = () => {
    //     setIsFollowing(!isFollowing);
    // };

    return (
        <div className={FeedCSS.feedDiv}>
            <div className={FeedCSS.feedRecDiv}>
                <button className={`${FeedCSS.feedRecBt} ${activeTab === 'rec' ? FeedCSS.activeTab : ''} `}
                        onClick={() => handleMainTabClick('rec')}>추천</button>
                <button className={`${FeedCSS.feedFollowBt} ${activeTab === 'following' ? FeedCSS.activeTab : ''} `}
                        onClick={() => handleMainTabClick('following')}>팔로잉</button>
            </div>
            {activeTab === 'rec' ? (
                <div>
                    <div className={FeedCSS.feedListBtDiv}>
                        <button className={`${FeedCSS.feedAllBt} ${subTab === 'all' ? FeedCSS.activeTaAf : FeedCSS.feedAllBt} `}
                        onClick={() => setSubTab('all')}>전체</button>
                        <button className={`${FeedCSS.feedPostBt} ${subTab === 'post' ? FeedCSS.activeTaAf : FeedCSS.feedPostBt} `}
                        onClick={() => setSubTab('post')}>포스트</button>
                        <button className={`${FeedCSS.feedReviewBt} ${subTab === 'review' ? FeedCSS.activeTaAf : FeedCSS.feedReviewBt} `}
                        onClick={() => setSubTab('review')}>리뷰</button>
                        <button className={FeedCSS.feedWritingBt}>
                            <img src={FeedRecWriting}/>
                        </button>
                    </div>
                    {renderRec()}
                </div>
            ) : (
                <div>
                    <div className={FeedCSS.feedListBtDiv}>
                        <button className={`${FeedCSS.feedAllBt} ${subTab === 'all' ? FeedCSS.activeTaAf : FeedCSS.feedAllBt} `}
                        onClick={() => setSubTab('all')}>전체</button>
                        <button className={`${FeedCSS.feedPostBt} ${subTab === 'post' ? FeedCSS.activeTaAf : FeedCSS.feedPostBt} `}
                        onClick={() => setSubTab('post')}>포스트</button>
                        <button className={`${FeedCSS.feedReviewBt} ${subTab === 'review' ? FeedCSS.activeTaAf : FeedCSS.feedReviewBt} `}
                        onClick={() => setSubTab('review')}>리뷰</button>
                        <button className={FeedCSS.feedWritingBt}>
                            <img src={FeedRecWriting}/>
                        </button>
                    </div>
                    {renderFollowing()}
                </div>
            )}
        </div>
    )
}

export default FeedMain