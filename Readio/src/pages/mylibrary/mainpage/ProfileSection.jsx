import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImg from '../../../assets/defaultImg.png';
import pencilIcon from '../../../assets/pencil.png';
import styles from './MyLibrary.module.css';
import { callPostsCountAPI } from "../../../apis/PostAPICalls.js"; // Redux API 호출
import { useDispatch, useSelector } from "react-redux"; // useDispatch, useSelector 복원

const ProfileSection = () => {
    const dispatch = useDispatch();
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
    // postCount는 Redux 스토어에서 직접 가져올 것이므로 별도의 useState는 필요 없습니다.
    const [myReviewsCount, setMyReviewsCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const isOwner = currentUserId === targetUserId;

    // Redux 스토어에서 포스트 관련 상태 가져오기
    // postReducer가 pageInfo를 포함하는 객체 형태의 상태를 관리한다고 가정합니다.
    const postsState = useSelector(state => state.postReducer);
    const postCount = postsState?.pageInfo?.total || 0; // postsReducer의 pageInfo에서 total을 가져와 postCount로 사용

    // --- 디버깅용 로그 추가 ---
    // postsState나 postCount 값이 변경될 때마다 콘솔에 출력됩니다.
    useEffect(() => {
        console.log("--- [ProfileSection] Redux postsState 변화 ---");
        console.log("현재 postsState:", postsState);
        console.log("추출된 postCount:", postCount); // 이 값이 계속 0인지 확인해주세요.
        console.log("---------------------------------------");
    }, [postsState, postCount]);
    // -------------------------

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

    // 메인 데이터 로딩 useEffect
    useEffect(() => {
        // 프로필 정보 가져오기
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

        // 북마크 카운트 가져오기
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

        // 포스트 개수를 Redux Thunk 액션을 통해 가져오기
        // 이 액션이 Redux 스토어의 postReducer를 업데이트한다고 가정합니다.
        if (targetUserId) {
            console.log(`[ProfileSection] callPostsCountAPI 디스패치! targetUserId: ${targetUserId}`);
            dispatch(callPostsCountAPI({userId: targetUserId}));
        } else {
            console.warn("[ProfileSection] targetUserId가 없어 포스트 개수 디스패치 건너뜀.");
        }

        // 모든 데이터 페칭 함수 호출
        fetchProfile();
        fetchBookmarkCounts();
        fetchMyReviewsCount(); // useCallback으로 정의된 함수 호출

    }, [targetUserId, dispatch, fetchMyReviewsCount]); // 의존성 배열에 모든 useCallback 함수와 dispatch 포함

    // 포스트 클릭 핸들러 (비공개 서재 처리 포함)
    const handlePostClick = () => {
        if (!isOwner && profile.isPrivate === 'PRIVATE') {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
        } else {
            navigate(`/mylibrary/postlist/${targetUserId}`);
        }
    };

    // 리뷰 클릭 핸들러 (PostList.js로 이동하며 'review' 탭 활성화 상태 전달)
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
                    {/* 포스트 카운트 */}
                    <div className={styles.statItem} onClick={handlePostClick} style={{ cursor: 'pointer' }}>
                        <strong>{postCount}</strong><span>포스트</span>
                    </div>
                    {/* 리뷰 카운트 */}
                    <div className={styles.statItem} onClick={handleReviewClick} style={{ cursor: 'pointer' }}>
                        <strong>{myReviewsCount}</strong><span>리뷰</span>
                    </div>
                    {/* 관심 영상 */}
                    <div className={styles.statItem}>
                        <strong onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'video' } })}>
                            {bookmarkedVideoCount}
                        </strong>
                        <span onClick={() => navigate(`/bookmark/${targetUserId}`, { state: { activeTab: 'video' } })}>
                            관심 영상
                        </span>
                    </div>
                    {/* 관심 책 */}
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