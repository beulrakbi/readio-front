import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FeedItemPost from '../../modules/feed/FeedItemPost';
import FeedItemReview from '../../modules/feed/FeedItemReview';
import SubTabNavigation from '../../modules/feed/SubTabNavigation';
import TabNavigation from '../../modules/feed/TabNavigation';
import { getFeedItemsAPI, setFeedTabs } from '../../modules/feed/feedSlice';

import { useNavigate } from 'react-router-dom';
import { apiFollowUser, apiUnfollowUser } from '../../apis/FollowAPICalls';
import { apiLikePost, apiUnlikePost } from '../../apis/PostLikeAPICalls';
import FeedCSS from './Feed.module.css';

const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};


function FeedMain() {
    const userRole = useSelector(state => state.user.userInfo?.userRole);  // 추가
    const navigate = useNavigate(); // 추가
    const dispatch = useDispatch();
    const { items, isLoading, error, activeMainTab, activeSubTab, currentPage, isLast } = useSelector(state => state.feed);
    const { isLogin, userInfo } = useSelector(state => state.user);
    const userEmotion = useSelector(state => state.userReducer?.emotion);
    const userInterests = useSelector(state => state.userReducer?.interests);
    const loginUserId = userInfo?.userId;
    const handleMainTabClick = (tabName) => {
        dispatch(setFeedTabs({ mainTab: tabName, subTab: 'all' }));
    };

    const handleSubTabClick = (tabName) => {
        dispatch(setFeedTabs({ mainTab: activeMainTab, subTab: tabName }));
    };


    // 정지 계정 피드 접근 불가
    useEffect(() => {
        if (userRole === 'SUSPENDED') {
            alert("정지된 계정은 피드에 접근할 수 없습니다.");
            navigate('/access-denied');  // 홈 또는 접근 가능한 다른 경로
        }
    }, [userRole, navigate]);



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
            if (isLogin) {
                params.loginUserId = loginUserId;
                if (activeMainTab === 'rec') { // 추천 탭일 때만 감정/관심사 전달
                    params.userEmotion = userEmotion;
                    params.userInterests = userInterests;
                }
            }

            await dispatch(getFeedItemsAPI(params));
        };

        fetchFeed(); // 컴포넌트 마운트 및 탭 변경 시 데이터 로드
    }, [activeMainTab, activeSubTab, isLogin, userEmotion, userInterests, loginUserId, dispatch]);

    const handleToggleFollow = async (profileId, isFollowing) => {
        if (!isLogin) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        const apiToDispatch = isFollowing ? apiUnfollowUser : apiFollowUser;

        try {
            // 1. 팔로우/언팔로우 API가 완료될 때까지 기다립니다.
            await dispatch(apiToDispatch(profileId));

            // 2. 성공하면, 피드 목록을 새로고침하여 UI를 업데이트합니다.
            //    (이 부분이 UI를 즉시 변경시키는 핵심 코드입니다.)
            console.log('팔로우 상태 변경 성공! 피드를 새로고침합니다.');
            dispatch(getFeedItemsAPI({
                mainTab: activeMainTab,
                subTab: activeSubTab,
                page: currentPage, // 현재 페이지를 다시 로드
                // ...기타 필요한 파라미터
            }));

        } catch (error) {
            console.error("팔로우 처리 오류:", error);
            alert(error.message || "팔로우 처리 중 오류가 발생했습니다.");
        }
    };

    // 좋아요/팔로우 토글 (백엔드 API 호출 필요)
    const handleToggleLike = async (itemId, itemType, isLiked) => {
        if (!isLogin) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        // 1. 게시물(POST) 좋아요 처리 (기존 로직 유지)
        if (itemType === 'POST') {
            console.log(`게시물 좋아요 토글: id=${itemId}`);
            const apiToDispatch = isLiked ? apiUnlikePost : apiLikePost;
            dispatch(apiToDispatch(itemId));

            // 2. 리뷰(REVIEW) 좋아요 처리 (BookReview.jsx 로직 참고하여 수정)
        } else if (itemType === 'REVIEW') {
            console.log(`리뷰 좋아요 토글: id=${itemId}`);

            try {
                // BookReviewController의 '/{reviewId}/like-toggle' API 호출
                const response = await fetch(`http://localhost:8080/bookReview/${itemId}/like-toggle`, {
                    method: 'POST',
                    headers: getAuthHeader()
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '리뷰 좋아요 처리에 실패했습니다.');
                }

                // 성공 시, 피드 목록을 새로고침하여 UI를 업데이트합니다.
                // (이것이 Redux 모듈을 새로 만들지 않고 할 수 있는 가장 간단한 방법입니다)
                console.log('리뷰 좋아요 성공! 피드를 새로고침합니다.');
                dispatch(getFeedItemsAPI({
                    mainTab: activeMainTab,
                    subTab: activeSubTab,
                    page: currentPage, // 현재 페이지를 다시 로드
                    size: 10,
                    loginUserId: loginUserId
                }));

            } catch (error) {
                console.error("리뷰 좋아요 처리 오류:", error);
                alert(error.message);
            }
        }
    };

    const handleReport = async (itemId, itemType) => {
        if (!isLogin) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        if (window.confirm("정말로 이 콘텐츠를 신고하시겠습니까?")) {

            let requestURL = '';
            let method = '';

            if (itemType === 'POST') {
                requestURL = `http://localhost:8080/post/report/${itemId}`;
                method = 'POST';
            } else if (itemType === 'REVIEW') {
                requestURL = `http://localhost:8080/bookReview/${itemId}/report`;
                method = 'PUT';
            } else {
                alert("알 수 없는 콘텐츠 타입입니다.");
                return;
            }

            try {
                console.log(`신고 요청: ${method} ${requestURL}`);
                const response = await fetch(requestURL, {
                    method: method,
                    headers: getAuthHeader(),
                });

                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message || '신고 처리에 실패했습니다.');
                }

                alert("신고가 성공적으로 접수되었습니다.");

            } catch (error) {
                console.error("신고 처리 오류:", error);
                alert(error.message);
            }
        }
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
            if (item.type?.toUpperCase() === 'POST') {
                return (
                    <FeedItemPost
                        key={`post-${item.id}`}
                        item={item}
                        loggedInUserId={loginUserId}
                        onToggleLike={() => handleToggleLike(item.id, 'POST', item.isLiked)}
                        onToggleFollow={() => handleToggleFollow(item.profileId, item.isFollowing)}
                        onReport={(postId) => handleReport(postId, 'POST')}
                    />
                );
            } else if (item.type?.toUpperCase() === 'REVIEW') {
                return (
                    <FeedItemReview
                        key={`review-${item.id}`}
                        item={item}
                        loggedInUserId={loginUserId}
                        onToggleLike={() => handleToggleLike(item.id, 'REVIEW', item.isLiked)}
                        onToggleFollow={() => handleToggleFollow(item.profileId, item.isFollowing)}
                        onReport={(postId) => handleReport(postId, 'REVIEW')}
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
                    isLogin, userEmotion, userInterests, loginUserId
                }))}>더보기</button>
            )}
        </div>
    );
}

export default FeedMain;