import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import book2 from '../../assets/book2.png';
import feedConImg from '../../assets/feedConImg.png';
import profileImg2 from '../../assets/profileImg2.png';
import profileImg3 from '../../assets/profileImg3.png';
import FeedItemPost from '../../modules/feed/FeedItemPost';
import FeedItemReview from '../../modules/feed/FeedItemReview';
import SubTabNavigation from '../../modules/feed/SubTabNavigation';
import TabNavigation from '../../modules/feed/TabNavigation';
import { getFeedItemsAPI, setFeedTabs } from '../../modules/feed/feedSlice';
import FeedCSS from './Feed.module.css';


function FeedMain() {
    const dispatch = useDispatch();
    const { items, isLoading, error, activeMainTab, activeSubTab, currentPage, isLast } = useSelector(state => state.feedReducer);
    const isLoggedIn = useSelector(state => state.userReducer?.isLoggedIn || false);
    const userEmotion = useSelector(state => state.userReducer?.emotion);
    const userInterests = useSelector(state => state.userReducer?.interests);
    const loginUserId = useSelector(state => state.userReducer?.userId);

    const [activeTab, setActiveTab] = useState('rec');
    const [subTab, setSubTab] = useState('all');
    const [isFollowing, setIsFollowing] = useState(false);
    const [likeTab, setLikeTab] = useState(false);

    const handleMainTabClick = (tabName) => {
        dispatch(setFeedTabs({ mainTab: tabName, subTab: 'all' }));
    };

    const handleSubTabClick = (tabName) => {
        dispatch(setFeedTabs({ mainTab: activeMainTab, subTab: tabName }));
    };

    // 피드 데이터 로드 (탭 변경 또는 페이지 변경 시)
    useEffect(() => {
        const fetchFeed = async () => {
            const params = {
                mainTab: activeMainTab,
                subTab: activeSubTab,
                page: 0, // 첫 페이지 로드
                size: 10,
            };

            // 로그인 상태에 따른 추가 파라미터
            if (isLoggedIn) {
                params.loginUserId = loginUserId;
                if (activeMainTab === 'rec') { // 추천 탭일 때만 감정/관심사 전달
                    params.userEmotion = userEmotion;
                    params.userInterests = userInterests;
                }
            }

            await dispatch(getFeedItemsAPI(params));
        };

        fetchFeed(); // 컴포넌트 마운트 및 탭 변경 시 데이터 로드
    }, [activeMainTab, activeSubTab, isLoggedIn, userEmotion, userInterests, loginUserId, dispatch]);

    const toggleFollow = (profileId, isFollowing) => {
        console.log(`Follow toggled for profile ${profileId}. Current following status: ${isFollowing}`);
        // TODO: 백엔드 팔로우/언팔로우 API 호출
        dispatch(callFollowAPI({ profileId, isFollowing: !isFollowing }));
    };

    // 좋아요/팔로우 토글 (백엔드 API 호출 필요)
    const toggleLike = (itemId, itemType, isLiked) => {
        console.log(`Like toggled for ${itemType} ${itemId}. Current liked status: ${isLiked}`);
        // TODO: 백엔드 좋아요/취소 API 호출
        dispatch(callLikeAPI({ itemId, itemType, isLiked: !isLiked }));
    };
    
    const handleReport = (itemId, itemType, reportReason) => {
        console.log(`신고 요청: ${itemType} ${itemId}, 사유: ${reportReason}`);
    };
    
    const renderFeedItems = () => {
        if (isLoading) {
            return <div className={FeedCSS.loadingContainer}><p>피드 불러오는 중...</p></div>;
        }
        if (error) {
            return <div className={FeedCSS.errorContainer}><p>피드를 불러오지 못했습니다: {error}</p></div>;
        }
        if (!items || items.length === 0) {
            return <div className={FeedCSS.noResultsContainer}><p>표시할 피드가 없습니다.</p></div>;
        }

        return items.map((item) => {
            if (item.type === 'POST') {
                return (
                    <FeedItemPost
                        key={`post-${item.id}`} // 고유 키
                        postId={item.id} // PostDetail.jsx의 postId와 연동
                        profileImg={item.profileImg || profileImg3} // 실제 데이터 사용
                        userName={item.userName}
                        postMeta={item.postMeta}
                        isLikedProp={item.isLiked}
                        isFollowingProp={item.isFollowing}
                        onToggleLike={() => toggleLike(item.id, 'POST', item.isLiked)}
                        onToggleFollow={() => toggleFollow(item.profileId, item.isFollowing)} // profileId 필요
                        onReport={() => handleReport(item.id, 'POST', 'reason')} // 신고 기능 연동
                        title={item.title}
                        text={item.content}
                        contentImg={item.contentImg || feedConImg}
                        likesCount={item.likesCount}
                        reviewsCount={item.reviewsCount}
                    />
                );
            } else if (item.type === 'REVIEW') {
                return (
                    <FeedItemReview
                        key={`review-${item.id}`} // 고유 키
                        reviewId={item.id} // 리뷰의 고유 ID
                        profileImg={item.profileImg || profileImg2} // 실제 데이터 사용
                        userName={item.userName}
                        postMeta={item.postMeta}
                        isLikedProp={item.isLiked}
                        isFollowingProp={item.isFollowing}
                        onToggleLike={() => toggleLike(item.id, 'REVIEW', item.isLiked)}
                        onToggleFollow={() => toggleFollow(item.profileId, item.isFollowing)} // profileId 필요
                        onReport={() => handleReport(item.id, 'REVIEW', 'reason')} // 신고 기능 연동
                        reviewText={item.reviewContent}
                        bookImg={item.bookCoverUrl || book2}
                        bookTitle={item.bookTitle}
                        bookAuthor={item.bookAuthor}
                    />
                );
            }
            return null;
        });
    };

    // const renderRec = () => {
    //     if (subTab === 'all') {
    //         return (
    //             <>
    //                 <FeedItemPost
    //                     profileImg={profileImg3}
    //                     userName="강적99"
    //                     postMeta="포스트 • 3분전"
    //                     isLikedProp={isLikedBoolean}
    //                     isFollowingProp={isFollowing}
    //                     onToggleLike={toggleLike}
    //                     onToggleFollow={toggleFollow}
    //                     title="어른의 맞춤법"
    //                     text="읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다."
    //                     contentImg={feedConImg}
    //                     likesCount={15}
    //                     reviewsCount={3}
    //                 />
    //                 <FeedItemReview
    //                     profileImg={profileImg2}
    //                     userName="배병"
    //                     postMeta="리뷰 • 5분전"
    //                     isLikedProp={isLikedBoolean}
    //                     isFollowingProp={isFollowing}
    //                     onToggleLike={toggleLike}
    //                     onToggleFollow={toggleFollow}
    //                     reviewText="재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검...."
    //                     bookImg={book2}
    //                     bookTitle="신화급 마검 헌터 1권"
    //                     bookAuthor="태일 지음"
    //                 />
    //             </>
    //         );
    //     } else if (subTab === 'post') {
    //         return (
    //             <FeedItemPost
    //                 profileImg={profileImg3}
    //                 userName="강적99"
    //                 postMeta="포스트 • 3분전"
    //                 isLikedProp={isLikedBoolean}
    //                 isFollowingProp={isFollowing}
    //                 onToggleLike={toggleLike}
    //                 onToggleFollow={toggleFollow}
    //                 title="어른의 맞춤법"
    //                 text="읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다."
    //                 contentImg={feedConImg}
    //                 likesCount={15}
    //                 reviewsCount={3}
    //             />
    //         );
    //     } else { // subTab === 'review'
    //         return (
    //             <FeedItemReview
    //                 profileImg={profileImg2}
    //                 userName="배병"
    //                 postMeta="리뷰 • 5분전"
    //                 isLikedProp={isLikedBoolean}
    //                 isFollowingProp={isFollowing}
    //                 onToggleLike={toggleLike}
    //                 onToggleFollow={toggleFollow}
    //                 reviewText="재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검...."
    //                 bookImg={book2}
    //                 bookTitle="신화급 마검 헌터 1권"
    //                 bookAuthor="태일 지음"
    //             />
    //         );
    //     }
    // }

    // const renderFollowing = () => {
    //     if (subTab === 'all') {
    //         return (
    //             <>
    //                 <FeedItemPost
    //                     profileImg={profileImg3}
    //                     userName="강적99"
    //                     postMeta="포스트 • 3분전"
    //                     isLikedProp={isLikedBoolean}
    //                     isFollowingProp={isFollowing}
    //                     onToggleLike={toggleLike}
    //                     onToggleFollow={toggleFollow}
    //                     title="어른의 맞춤법"
    //                     text="팔로잉 탭에 표시될 포스트 내용입니다. 실제로는 다른 데이터가 와야 합니다."
    //                     contentImg={feedConImg}
    //                     likesCount={15}
    //                     reviewsCount={3}
    //                 />
    //                 <FeedItemReview
    //                     profileImg={profileImg2}
    //                     userName="배병"
    //                     postMeta="리뷰 • 5분전"
    //                     isLikedProp={isLikedBoolean}
    //                     isFollowingProp={isFollowing}
    //                     onToggleLike={toggleLike}
    //                     onToggleFollow={toggleFollow}
    //                     reviewText="팔로잉 탭에 표시될 리뷰 내용입니다. 실제로는 다른 데이터가 와야 합니다."
    //                     bookImg={book2}
    //                     bookTitle="신화급 마검 헌터 1권"
    //                     bookAuthor="태일 지음"
    //                 />
    //             </>
    //         );
    //     } else if (subTab === 'post') {
    //         return (
    //             <FeedItemPost
    //                 profileImg={profileImg3}
    //                 userName="강적99"
    //                 postMeta="포스트 • 3분전"
    //                 isLikedProp={isLikedBoolean}
    //                 isFollowingProp={isFollowing}
    //                 onToggleLike={toggleLike}
    //                 onToggleFollow={toggleFollow}
    //                 title="어른의 맞춤법"
    //                 text="팔로잉 탭에 표시될 포스트 내용입니다. 실제로는 다른 데이터가 와야 합니다."
    //                 contentImg={feedConImg}
    //                 likesCount={15}
    //                 reviewsCount={3}
    //             />
    //         );
    //     } else {
    //         return (
    //             <FeedItemReview
    //                 profileImg={profileImg2}
    //                 userName="배병"
    //                 postMeta="리뷰 • 5분전"
    //                 isLikedProp={isLikedBoolean}
    //                 isFollowingProp={isFollowing}
    //                 onToggleLike={toggleLike}
    //                 onToggleFollow={toggleFollow}
    //                 reviewText="팔로잉 탭에 표시될 리뷰 내용입니다. 실제로는 다른 데이터가 와야 합니다."
    //                 bookImg={book2}
    //                 bookTitle="신화급 마검 헌터 1권"
    //                 bookAuthor="태일 지음"
    //             />
    //         );
    //     }
    // }

    return (
        <div className={FeedCSS.feedDiv}>
            <TabNavigation activeTab={activeMainTab} onMainTabClick={handleMainTabClick} />
            <SubTabNavigation subTab={activeSubTab} onSubTabClick={handleSubTabClick} />

            {renderFeedItems()}

            {isLoading && items.length > 0 && <div className={FeedCSS.loadingMore}><p>더 불러오는 중...</p></div>}
            {!isLast && !isLoading && items.length > 0 && (
                <button className={FeedCSS.loadMoreButton} onClick={() => dispatch(getFeedItemsAPI({
                    mainTab: activeMainTab, subTab: activeSubTab, page: currentPage + 1, size: 10,
                    isLoggedIn, userEmotion, userInterests, loginUserId
                }))}>더보기</button>
            )}
        </div>
    );
}

export default FeedMain;