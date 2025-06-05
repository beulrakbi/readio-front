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
    const { items, isLoading, error, activeMainTab, activeSubTab, currentPage, isLast } = useSelector(state => state.feed);
    const isLoggedIn = useSelector(state => state.userReducer?.isLoggedIn || false);
    const userEmotion = useSelector(state => state.userReducer?.emotion);
    const userInterests = useSelector(state => state.userReducer?.interests);
    const loginUserId = useSelector(state => state.userReducer?.userId);

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
        if (isLoading && items.length === 0) {
            return <div className={FeedCSS.loadingContainer}><p>피드 불러오는 중...</p></div>;
        }
        if (error) {
            return <div className={FeedCSS.errorContainer}><p>피드를 불러오지 못했습니다: {error}</p></div>;
        }
        if (!Array.isArray(items) || items.length === 0) {
            return <div className={FeedCSS.noResultsContainer}><p>표시할 피드가 없습니다.</p></div>;
        }

        return items.map((item) => {
            if (item.type === 'POST') {
                return (
                    <FeedItemPost
                        key={`post-${item.id}`}
                        item={item}
                        onToggleLike={() => toggleLike(item.id, 'POST', item.isLiked)}
                        onToggleFollow={() => toggleFollow(item.profileId, item.isFollowing)}
                        onReport={handleReport}
                    />
                );
            } else if (item.type === 'REVIEW') {
                return (
                    <FeedItemReview
                        key={`review-${item.id}`}
                        item={item} // DTO item 객체 전체를 prop으로 전달
                        onToggleLike={() => toggleLike(item.id, 'REVIEW', item.isLiked)}
                        onToggleFollow={() => toggleFollow(item.profileId, item.isFollowing)}
                        onReport={handleReport}
                    />
                );
            }
            return null;
        });
    };

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