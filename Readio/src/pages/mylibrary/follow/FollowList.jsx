import FollowCSS from "./Follow.module.css";
import defaultProfileImg from '../../../assets/defaultImg.png';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

import { getFollowersAPI, getFollowingAPI } from "../../../modules/follow/followListSlice"; 
import { apiFollowUser, apiUnfollowUser } from "../../../apis/FollowAPICalls";

function FollowList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams(); // URL에서 현재 보고 있는 프로필의 userId를 가져옴
    const { state: locationState } = useLocation(); // ProfileSection에서 넘겨준 탭 정보

    const [profileId, setProfileId] = useState(null);
     const [viewingUsername, setViewingUsername] = useState('');
    // ProfileSection에서 전달한 탭 정보를 기본값으로 사용
    const [activeTab, setActiveTab] = useState(locationState?.defaultTab || 'follower');
    
    // Redux 스토어에서 팔로우 데이터와 로그인한 사용자 ID 가져오기
    const { followers, following, isLoading, error } = useSelector(state => state.followList);
    const loggedInUserId = useSelector(state => state.user.userInfo?.userId);
    const loggedInProfileId = useSelector(state => state.user.userInfo?.profileId);

    console.log("2. Redux 스토어 상태:", { followers, following });
    
    // 탭이 바뀌거나 userId가 바뀔 때 데이터를 새로 불러옴
   useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:8080/api/user/profile/${userId}`)
            .then(res => {
                console.log("1. 프로필 API 응답:", res.data); 
                setProfileId(res.data.profileId);
                setViewingUsername(res.data.penName);
            })
            .catch(err => console.error("프로필 정보 조회 실패:", err));

    }, [userId]);

    useEffect(() => {
        if (!profileId) return; // 숫자 profileId가 없으면 API 호출 방지

        if (activeTab === 'follower') {
            dispatch(getFollowersAPI({ profileId }));
        } else {
            dispatch(getFollowingAPI({ profileId }));
        }
    }, [dispatch, profileId, activeTab]);

    // 팔로우/언팔로우 토글 핸들러
    const handleToggleFollow = async (targetProfileId, isCurrentlyFollowing) => {
        if (!loggedInUserId) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }

        const apiToDispatch = isCurrentlyFollowing ? apiUnfollowUser : apiFollowUser;
        try {
            if (isCurrentlyFollowing) {
                await dispatch(apiToDispatch(targetProfileId));
            } else {
                await dispatch(apiToDispatch({ followingProfileId: targetProfileId }, targetProfileId));
            }
            
            // 성공 후, 현재 활성화된 탭의 목록을 다시 불러와서 UI를 즉시 업데이트
            if (activeTab === 'follower') {
                dispatch(getFollowersAPI({ profileId }));
            } else {
                dispatch(getFollowingAPI({ profileId }));
            }
        } catch (err) {
            console.error("팔로우 처리 실패:", err);
            alert("팔로우 처리 중 오류가 발생했습니다.");
        }
    };

    // 탭에 따라 렌더링할 목록과 숫자 결정
    const currentList = activeTab === 'follower' ? followers.list : following.list;
    const followerCount = followers.list?.length || 0; // pageInfo 대신 list.length로 카운트
    const followingCount = following.list?.length || 0;

    return (
        <div className={FollowCSS.followDiv}>
            <button className={FollowCSS.followBackBt} onClick={() => navigate(-1)}>&lt; {viewingUsername}</button>
            <div className={FollowCSS.followTapDiv}>
                <div className={FollowCSS.followListBtDiv}>
                    <button 
                        className={`${FollowCSS.followListBt} ${activeTab === 'follower' ? FollowCSS.activeTab : ''}`}
                        onClick={() => setActiveTab('follower')}
                    >
                        팔로워 {followerCount}
                    </button>
                </div>
                <div className={FollowCSS.followListBtDiv}>
                    <button 
                        className={`${FollowCSS.followListBt} ${activeTab === 'following' ? FollowCSS.activeTab : ''}`}
                        onClick={() => setActiveTab('following')}
                    >
                        팔로잉 {followingCount}
                    </button>
                </div>
            </div>

            {isLoading && <p className={FollowCSS.messageText}>목록을 불러오는 중입니다...</p>}
            {error && <p className={`${FollowCSS.messageText} ${FollowCSS.errorText}`}>오류가 발생했습니다: {error}</p>}
            {!isLoading && currentList && currentList.length === 0 && (
                <p className={FollowCSS.messageText}>표시할 사용자가 없습니다.</p>
            )}

            {!isLoading && currentList && currentList.map(user => {
                console.log("3. 렌더링 직전 개별 사용자 데이터:", user)
                
                return(
                <div key={user.profileId} className={FollowCSS.followProfileDiv}>
                    <img 
                        src={user.imageUrl ? `http://localhost:8080/img/profile/${user.imageUrl}` : defaultProfileImg} 
                        className={FollowCSS.followProfileImg} 
                        alt="profile" 
                        onClick={() => navigate(`/mylibrary/${user.profileId}`)}
                        style={{cursor: 'pointer'}}
                    />
                    <div className={FollowCSS.followProfile} onClick={() => navigate(`/mylibrary/${user.profileId}`)} style={{cursor: 'pointer'}}>
                        <li className={FollowCSS.followProfileFont}>{user.penName}</li>
                        <li className={FollowCSS.followFont}>팔로워 {user.followerCount}명</li>
                    </div>
                    {/* 로그인했고, 내 프로필이 아닐 때만 팔로우 버튼 표시 */}
                    {loggedInUserId && String(user.profileId) !== String(loggedInUserId) && (
                         <button
                            className={`${FollowCSS.followBt} ${user.following  ? FollowCSS.followingBt : ''}`}
                            onClick={() => handleToggleFollow(user.profileId, user.following )}
                        >
                            {user.following  ? '팔로잉' : '팔로우'}
                        </button>
                    )}
                </div>
                );
            })}
            
            {/* 페이지네이션이 필요하다면 PostList.jsx의 로직을 참고하여 여기에 추가 */}
        </div>
    );
}

export default FollowList;