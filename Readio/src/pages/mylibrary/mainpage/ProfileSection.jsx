import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImg from '../../../assets/defaultImg.png';
import pencilIcon from '../../../assets/pencil.png';
import styles from './MyLibrary.module.css';
import {callPostsCountAPI} from "../../../apis/PostAPICalls.js";
import {useDispatch, useSelector} from "react-redux";
import {callMyBookReviewsCountAPI} from "../../../apis/BookAPICalls.js";


const ProfileSection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const currentUserId = sessionStorage.getItem("userId");
    const targetUserId = paramUserId || currentUserId;
    
    useEffect(() => {
        console.log("currentUserId", currentUserId);
        console.log("param", paramUserId);
        console.log("userid", targetUserId);
    },[targetUserId, currentUserId, paramUserId])

    const [profile, setProfile] = useState({
        profileId: null,
        penName: '',
        biography: '',
        imageUrl: '',
        isPrivate: 'PUBLIC',
    });

    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    // 관심 영상과 관심 책의 수를 저장할 상태 변수
    const [bookmarkedVideoCount, setBookmarkedVideoCount] = useState(0);
    const [bookmarkedBookCount, setBookmarkedBookCount] = useState(0);
    const postCount = useSelector(state=> state.postReducer);
    const reviewCount = useSelector(state => state.bookReview.reviews);
    const [showPopup, setShowPopup] = useState(false);
    const isOwner = currentUserId === targetUserId;

    // 인증 헤더를 가져오는 유틸리티 함수
    const getAuthHeader = () => {
        const token = sessionStorage.getItem('accessToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");

                const res = await axios.get(`/api/user/profile/${targetUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });

                setProfile(res.data);
            } catch (err) {
                console.error('프로필 조회 실패:', err);
            }
        };

        // 북마크 카운트를 가져오는 함수
        const fetchBookmarkCounts = async () => {
            const authHeader = getAuthHeader();
            if (!authHeader['Authorization']) {
                console.warn("북마크 카운트를 가져오려면 로그인이 필요합니다.");
                setBookmarkedVideoCount(0);
                setBookmarkedBookCount(0);
                return;
            }

            try {
                // 영상 북마크 카운트 가져오기
                const videoRes = await axios.get(`http://localhost:8080/videoBookmark/list`, {
                    headers: authHeader
                });
                setBookmarkedVideoCount(videoRes.data.length);

                // 책 북마크 카운트 가져오기
                // 백엔드에서 userId 파라미터 없이 @AuthenticationPrincipal로 처리한다면 아래처럼 사용
                const bookRes = await axios.get(`http://localhost:8080/bookBookmark/list`, {
                // 백엔드에서 userId를 쿼리 파라미터로 요구한다면 아래처럼 사용
                // const bookRes = await axios.get(`http://localhost:8080/bookBookmark/list?userId=${targetUserId}`, {
                    headers: authHeader
                });
                setBookmarkedBookCount(bookRes.data.length);

            } catch (err) {
                console.error('북마크 카운트 조회 실패:', err);
                setBookmarkedVideoCount(0);
                setBookmarkedBookCount(0);
            }
        };

        const fetchFollowCounts = async () => {
            if (!targetUserId) return;

            try {
                const token = sessionStorage.getItem("accessToken");
                const authHeader = getAuthHeader();

                const profileRes = await axios.get(`http://localhost:8080/api/user/profile/${targetUserId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });

                const fetchedProfileData = profileRes.data;
                setProfile(fetchedProfileData);
                const targetProfileId = fetchedProfileData.profileId;

                if (targetProfileId !== null) {
                    const [followersRes, followingRes] = await Promise.all([
                        axios.get(`http://localhost:8080/api/follow/${targetProfileId}/followers`, {
                            headers: authHeader
                        }),
                        axios.get(`http://localhost:8080/api/follow/${targetProfileId}/following`, {
                            headers: authHeader
                        })
                    ]);

                    setFollowerCount(followersRes.data.length);
                    console.log(`팔로워 수 (${targetProfileId}):`, followersRes.data.length);
                    setFollowingCount(followingRes.data.length);
                    console.log(`팔로잉 수 (${targetProfileId}):`, followingRes.data.length);
                } else {
                    console.warn(`프로필 ID(${targetUserId})를 가져올 수 없어 팔로우 카운트를 조회하지 못했습니다.`);
                    setFollowerCount(0);
                    setFollowingCount(0);
                }

            } catch (err) {
                console.error('프로필 또는 팔로우 카운트 조회 실패:', err);
                setFollowerCount(0);
                setFollowingCount(0);
                setProfile({ // 오류 시 프로필 정보 초기화
                    profileId: null, penName: '', biography: '', imageUrl: '', isPrivate: 'PUBLIC',
                });
            }
        };

        const fetchPostCount = () => {
            dispatch(callPostsCountAPI({userId: targetUserId}));
        };
        const fetchReviewCount = () => {
            dispatch(callMyBookReviewsCountAPI());
        };

        

        fetchProfile();
        fetchBookmarkCounts();
        fetchFollowCounts();
        fetchPostCount();
        fetchReviewCount();
    }, [targetUserId, dispatch]);

    useEffect(() => {
        console.log("counts", reviewCount);
        console.log("postcounts", postCount);
    }, [reviewCount, postCount])



    const handleNavigateToFollowList = (defaultTab) => {
        if (!isOwner && profile.isPrivate === 'PRIVATE') {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        } else {
            navigate(`/mylibrary/follow/${targetUserId}`, { state: { defaultTab: defaultTab } });
        }
    };


    return (
        <div className={styles.profileSectionWrapper}>
            <div
                className={styles.profileCard}
            >
                <div className={styles.profileImageWrapper}>
                    <img src={profile.imageUrl ? `http://localhost:8080${profile.imageUrl}` : defaultImg} className={styles.profileImage} />

                    {isOwner && (
                        <img src={pencilIcon} className={styles.editIcon} alt="편집"  onClick={() => isOwner && navigate('/mylibrary/profile')}
                             style={{ cursor: isOwner ? 'pointer' : 'default' }}/>
                    )}
                </div>

                <div className={styles.profileInfo}>
                    <h2 className={styles.nickname}>{profile.penName || 'Readio 기본 필명'}</h2>
                    <p className={styles.followInfo}>
                        <span className={styles.followLink} onClick={() => handleNavigateToFollowList('follower')}>
                            팔로워 {followerCount}
                        </span>
                        <span style={{ margin: '0 8px' }}>・</span>
                        <span className={styles.followLink} onClick={() => handleNavigateToFollowList('following')}>
                            팔로잉 {followingCount}
                        </span>
                    </p>
                </div>

                <p className={styles.description}>
                    {profile.biography ? profile.biography : (
                        <>
                            안녕하세요 여기는 내서재 페이지 입니다.<br />
                            프로필 편집 누르고 필명과 서재소개를 작성해 보세요.<br />
                            필명은 readio에서 보이는 나의 활동명이에요.
                        </>
                    )}
                </p>
            </div>

            <div className={styles.outProfileInfo}>
                <div className={styles.stats}>
                    <div
                        className={styles.statItem}
                        onClick={() => navigate(`/mylibrary/postAndReview/`, { state: { click: 'post' } })}
                        style={{ cursor: 'pointer' }}
                    >
                        <strong>{postCount.data}</strong><span>포스트</span>
                    </div>
                    <div
                        className={styles.statItem}
                        onClick={() => navigate(`/mylibrary/postAndReview/`, { state: { click: 'review' } })}
                        style={{ cursor: 'pointer' }}
                    >
                        <strong>{reviewCount.length}</strong><span>리뷰</span>
                    </div>

                    {/* 관심 영상 클릭 시 'video' 탭 정보를 전달 */}
                    <div className={styles.statItem}>
                        <strong
                            onClick={() => {
                                if (!isOwner && profile.isPrivate === 'PRIVATE') {
                                    setShowPopup(true);
                                    setTimeout(() => setShowPopup(false), 2000);
                                } else {
                                    navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'video' } });
                                }
                            }}
                        >
                            {bookmarkedVideoCount}
                        </strong>
                        <span
                            onClick={() => {
                                if (!isOwner && profile.isPrivate === 'PRIVATE') {
                                    setShowPopup(true);
                                    setTimeout(() => setShowPopup(false), 2000);
                                } else {
                                    navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'video' } });
                                }
                            }}
                        >
        관심 영상
    </span>
                    </div>
                    <div className={styles.statItem}>
                        <strong
                            onClick={() => {
                                if (!isOwner && profile.isPrivate === 'PRIVATE') {
                                    setShowPopup(true);
                                    setTimeout(() => setShowPopup(false), 2000);
                                } else {
                                    navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'book' } });
                                }
                            }}
                        >
                            {bookmarkedBookCount}
                        </strong>
                        <span
                            onClick={() => {
                                if (!isOwner && profile.isPrivate === 'PRIVATE') {
                                    setShowPopup(true);
                                    setTimeout(() => setShowPopup(false), 2000);
                                } else {
                                    navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'book' } });
                                }
                            }}
                        >
        관심 책
    </span>
                    </div>

                </div>

                <div className={styles.buttons}>
                    {isOwner && (
                        <button className={styles.postBtn} onClick={() => navigate('post/writing')}>✏️ 포스트 작성</button>
                    )}
                    <button
                        className={styles.interestBtn}
                        onClick={() => {
                            if (isOwner) {
                                navigate('/mylibrary/interest');
                            } else {
                                navigate(`/mylibrary/interest/${targetUserId}`);
                            }
                        }}
                    >
                        📌 나의 관심사
                    </button>
                </div>
            </div>

            {showPopup && (
                <div className={styles.showPopup}>비공개 서재입니다.</div>
            )}

            <hr className={styles.sectionDivider} />
        </div>
    );
};

export default ProfileSection;