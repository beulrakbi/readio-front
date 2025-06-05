import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImg from '../../../assets/defaultImg.png';
import pencilIcon from '../../../assets/pencil.png';
import styles from './MyLibrary.module.css';

const ProfileSection = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const currentUserId = sessionStorage.getItem("userId");
    const targetUserId = paramUserId || currentUserId;

    const [profile, setProfile] = useState({
        penName: '',
        biography: '',
        imageUrl: '',
        isPrivate: 'PUBLIC',
    });

    const [bookmarkedVideoCount, setBookmarkedVideoCount] = useState(0);
    const [bookmarkedBookCount, setBookmarkedBookCount] = useState(0);
    const [myReviewsCount, setMyReviewsCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [postCount, setPostCount] = useState(0); // 포스트 개수 상태 직접 관리
    const isOwner = currentUserId === targetUserId;

    // 인증 헤더를 가져오는 유틸리티 함수
    const getAuthHeader = () => {
        const token = sessionStorage.getItem('accessToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // 내 리뷰의 총 개수만 비동기로 가져오는 함수
    const fetchMyReviewsCount = useCallback(async () => {
        if (!targetUserId || !getAuthHeader()['Authorization']) {
            setMyReviewsCount(0);
            console.warn("[ProfileSection] 리뷰 개수 로드 건너뜀: 로그인 필요 또는 targetUserId 없음.");
            return;
        }
        try {
            const authHeader = getAuthHeader();
            const requestURL = `http://localhost:8080/bookReview/reviews/my`;
            const response = await axios.get(requestURL, { headers: authHeader });
            if (response.status === 200 && response.data) {
                setMyReviewsCount((response.data && response.data.length) || 0);
            } else {
                setMyReviewsCount(0);
            }
        } catch (err) {
            console.error(`[ProfileSection] 리뷰 개수 로드 중 오류 발생:`, err);
            setMyReviewsCount(0);
        }
    }, [targetUserId]);

    // 포스트 개수를 직접 가져오는 함수 (수정된 부분)
    const fetchPostsCount = useCallback(async () => {
        console.log("--- fetchPostsCount 시작 ---");
        if (!targetUserId) {
            setPostCount(0);
            console.log("[fetchPostsCount] targetUserId가 없어 포스트 개수를 가져오지 못함.");
            console.log("--- fetchPostsCount 종료 ---");
            return;
        }
        try {
            const requestURL = `http://localhost:8080/mylibrary/post/${targetUserId}/all?offset=1&limit=1`;
            const authHeader = getAuthHeader();

            console.log("[fetchPostsCount] API 요청 URL:", requestURL);
            console.log("[fetchPostsCount] 요청 헤더:", authHeader);

            const response = await axios.get(requestURL, { headers: authHeader });

            console.log("[fetchPostsCount] API 응답 상태:", response.status);
            console.log("[fetchPostsCount] API 응답 데이터:", response.data); // 이 JSON 구조를 꼭 확인하세요.

            // --- 이 부분이 핵심적으로 수정된 부분입니다. ---
            // 서버 응답이 response.data 안에 또 다른 'data' 객체가 있고, 그 안에 pageInfo.total이 있는 경우를 처리합니다.
            // 즉, { status: ..., message: ..., data: { data: [ ... ], pageInfo: { total: ... } } } 형태
            let total = 0;
            if (response.status === 200 && response.data && response.data.data && response.data.data.pageInfo) {
                if (typeof response.data.data.pageInfo.total === 'number') {
                    total = response.data.data.pageInfo.total;
                }
            }
            // --- 수정 끝 ---

            setPostCount(total);
            console.log(`[fetchPostsCount] 성공적으로 포스트 개수 설정: ${total}`);

        } catch (err) {
            console.error('[ProfileSection] 포스트 개수 조회 중 오류 발생:', err);
            setPostCount(0);
        } finally {
            console.log(`[fetchPostsCount] 최종 postCount 상태: ${postCount}`);
            console.log("--- fetchPostsCount 종료 ---");
        }
    }, [targetUserId, postCount]);

    // 메인 데이터 로딩 useEffect
    useEffect(() => {
        const fetchProfile = async () => {
            if (!targetUserId) return;
            try {
                const token = sessionStorage.getItem("accessToken");
                const res = await axios.get(`/api/user/profile/${targetUserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                setProfile(res.data);
            } catch (err) {
                console.error('[ProfileSection] 프로필 조회 실패:', err);
            }
        };

        const fetchBookmarkCounts = async () => {
            const authHeader = getAuthHeader();
            if (!authHeader['Authorization']) {
                setBookmarkedVideoCount(0);
                setBookmarkedBookCount(0);
                console.warn("[ProfileSection] 북마크 카운트 로드 건너뜀: 로그인 필요.");
                return;
            }
            try {
                const videoRes = await axios.get(`http://localhost:8080/videoBookmark/list`, { headers: authHeader });
                setBookmarkedVideoCount(videoRes.data.length);

                const bookRes = await axios.get(`http://localhost:8080/bookBookmark/list`, { headers: authHeader });
                setBookmarkedBookCount(bookRes.data.length);
            } catch (err) {
                console.error('[ProfileSection] 북마크 카운트 조회 실패:', err);
                setBookmarkedVideoCount(0);
                setBookmarkedBookCount(0);
            }
        };

        fetchProfile();
        fetchBookmarkCounts();
        fetchMyReviewsCount();
        fetchPostsCount(); // 직접 정의한 포스트 개수 가져오는 함수 호출

    }, [targetUserId, fetchMyReviewsCount, fetchPostsCount]);

    const handlePostClick = () => {
        if (!isOwner && profile.isPrivate === 'PRIVATE') {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        } else {
            navigate(`/mylibrary/postlist/${targetUserId}`);
        }
    };

    const handleReviewClick = () => {
        navigate(`/mylibrary/postlist/${targetUserId}`, { state: { activeTab: 'review' } });
    };

    return (
        <div className={styles.profileSectionWrapper}>
            <div className={styles.profileCard}>
                <div className={styles.profileImageWrapper}>
                    <img
                        src={profile.imageUrl ? `http://localhost:8080${profile.imageUrl}` : defaultImg}
                        className={styles.profileImage}
                        alt="프로필 이미지"
                    />

                    {isOwner && (
                        <img
                            src={pencilIcon}
                            className={styles.editIcon}
                            alt="편집"
                            onClick={() => navigate('/mylibrary/profile')}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                </div>

                <div className={styles.profileInfo}>
                    <h2 className={styles.nickname}>{profile.penName || 'Readio 기본 필명'}</h2>
                    <p>등급 : 재미있는 활동가</p>
                    <p>팔로워 2 ・ 팔로잉 2</p> {/* 이 부분은 실제 데이터로 채워야 합니다. */}
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
                    <div className={styles.statItem} onClick={handlePostClick} style={{ cursor: 'pointer' }}>
                        <strong>{postCount}</strong><span>포스트</span>
                    </div>
                    <div className={styles.statItem} onClick={handleReviewClick} style={{ cursor: 'pointer' }}>
                        <strong>{myReviewsCount}</strong><span>리뷰</span>
                    </div>
                    <div className={styles.statItem}>
                        <strong onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'video' } })}>
                            {bookmarkedVideoCount}
                        </strong>
                        <span onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'video' } })}>
                            관심 영상
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <strong onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'book' } })}>
                            {bookmarkedBookCount}
                        </strong>
                        <span onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'book' } })}>
                            관심 책
                        </span>
                    </div>
                </div>

                <div className={styles.buttons}>
                    {isOwner && (
                        <button className={styles.postBtn} onClick={() => navigate('post/writing')}>+ 포스트 작성하기</button>
                    )}
                    <button className={styles.interestBtn} onClick={() => navigate('/mylibrary/interest')}>
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