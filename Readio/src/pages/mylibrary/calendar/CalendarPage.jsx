import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Calendar.module.css';
import EmotionModal from './EmotionModal';

const CalendarPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emotionData, setEmotionData] = useState({});
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedTab, setSelectedTab] = useState('전체');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const today = dayjs();
    const [postData, setPostData] = useState({});
    const userId = sessionStorage.getItem("userId");        //5.30 변경_이상있으면 말해주세요
    const token = sessionStorage.getItem("accessToken");    //5.30 변경_이상있으면 말해주세요
    // const token = localStorage.getItem("accessToken");


    const convertEmojiToEnum = (emoji) => {
        switch (emoji) {
            case '🙂': return 'NORMAL';
            case '😁': return 'HAPPY';
            case '😭': return 'SAD';
            case '😡': return 'ANGRY';
            case '😵‍💫': return 'ANXIOUS';
            default: return 'NORMAL';
        }
    };

    const convertLabelToEmoji = (enumName) => {
        switch (enumName) {
            case 'NORMAL': return '🙂';
            case 'HAPPY': return '😁';
            case 'SAD': return '😭';
            case 'ANGRY': return '😡';
            case 'ANXIOUS': return '😵‍💫';
            default: return '🙂';
        }
    };


    const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
    const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

    const handleDateClick = (date) => {
        if (!date) return;
        const fullDate = dayjs(new Date(currentMonth.year(), currentMonth.month(), date));
        if (fullDate.isAfter(today, 'day')) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }
        if (selectedDate && fullDate.isSame(selectedDate, 'day')) {
            setSelectedDate(null);
            return;
        }
        setSelectedDate(fullDate);
    };

    const handleRegisterEmotion = () => {
        if (!selectedDate) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }
        setIsModalOpen(true);
    };

    const handleEmotionSelect = async (emoji) => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        const key = selectedDate.format('YYYY-MM-DD');
        const requestData = {
            userId: userId,
            emotionType: convertEmojiToEnum(emoji),
            date: key
        };
        try {
            const response = await fetch('/api/user/emotions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                setEmotionData((prev) => ({ ...prev, [key]: emoji }));
            } else {
                alert('감정 등록 실패');
            }
        } catch (error) {
            console.error('감정 등록 오류:', error);
        }
        setIsModalOpen(false);
    };

    const handleDeleteEmotion = async () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!selectedDate) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }
        const key = selectedDate.format('YYYY-MM-DD');
        try {
            const response = await fetch(`/api/user/emotions?userId=${userId}&date=${key}`, {
                method: 'DELETE',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setEmotionData((prev) => {
                    const updated = { ...prev };
                    delete updated[key];
                    return updated;
                });
            } else {
                alert('감정 삭제 실패');
            }
        } catch (error) {
            console.error('감정 삭제 오류:', error);
        }
    };

    useEffect(() => {
        const fetchEmotions = async () => {
            const token = sessionStorage.getItem("accessToken");    // 5.30 변경테스트중
            const userId = sessionStorage.getItem("userId");        // 5.30 변경테스트중
            // const token = localStorage.getItem("accessToken");
            // const userId = localStorage.getItem("userId");

            if (!userId || !token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const year = currentMonth.year();
            const month = currentMonth.month() + 1;

            try {
                const response = await fetch(`/api/user/emotions?userId=${userId}&year=${year}&month=${month}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error("감정 데이터 불러오기 실패:", response.status);
                    return;
                }

                const data = await response.json();
                const parsed = {};
                console.log('백엔드 응답:', data);

                data.forEach(({ emotionCode, date }) => {
                    parsed[date] = convertLabelToEmoji(emotionCode);
                });

                setEmotionData(parsed);
            } catch (err) {
                console.error("감정 조회 중 에러:", err);
            }
        };

        fetchEmotions();
    }, [currentMonth]);

    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (!token) return;

            try {
                const res = await fetch('http://localhost:8080/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.error('프로필 정보 불러오기 실패');
                    return;
                }

                const data = await res.json();
                console.log("사용자 프로필 응답:", data);
                sessionStorage.setItem("profileId", data.profileId);

                //  profileId 저장 후 fetchPosts 실행
                await fetchPosts(data.profileId);
            } catch (e) {
                console.error('프로필 요청 중 오류', e);
            }
        };

        fetchProfileAndPosts();
    }, [currentMonth]);


    const fetchPosts = async (profileIdFromServer) => {
        const token = sessionStorage.getItem("accessToken");
        const profileId = profileIdFromServer ?? sessionStorage.getItem("profileId");
        console.log("사용될 profileId:", profileId);
        if (!profileId || !token) return;

        const year = currentMonth.year();
        const month = currentMonth.month() + 1;

        try {
            const res = await fetch(`http://localhost:8080/mylibrary/post/summary?profileId=${profileId}&year=${year}&month=${month}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('포스트 불러오기 실패');

            const result = await res.json();
            const postList = result.data ?? [];

            const parsed = {};
            postList.forEach(({ date, postCount, postIds }) => {
                parsed[date] = { count: postCount, postIds };
            });

            setPostData(parsed);
        } catch (err) {
            console.error("포스트 불러오기 에러:", err);
        }
    };

    const getDaysArray = () => {
        const startDay = dayjs(new Date(currentMonth.year(), currentMonth.month(), 1)).day();
        const lastDate = dayjs(new Date(currentMonth.year(), currentMonth.month() + 1, 0)).date();
        const days = [];
        for (let i = 0; i < startDay; i++) days.push(null);
        for (let d = 1; d <= lastDate; d++) days.push(d);
        return days;
    };

    const days = getDaysArray();

    return (
        <div className={styles.calendarPageWrapper}>
            <div className={styles.wrapper}>
                <h2 className={styles.title} onClick={() => navigate('/mylibrary')} style={{ cursor: 'pointer' }}>
                    &lt; 뒤로가기
                </h2>

                <h2 className={styles.subtitle}>
                    <button onClick={handlePrevMonth} className={`${styles.triangleBtn} ${styles.left}`}></button>
                    {currentMonth.format('YYYY년 M월 활동 달력')}
                    <button onClick={handleNextMonth} className={`${styles.triangleBtn} ${styles.right}`}></button>
                </h2>

                <div className={styles.tabBar}>
                    {['전체', '감정', '포스트'].map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tabButton} ${selectedTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {showPopup && <div className={styles.showPopup}>날짜를 선택해주세요.</div>}

                <div className={styles.actionTextButtons}>
                    <span className={styles.textButton} onClick={handleRegisterEmotion}>+ 감정 등록</span>
                    <span className={styles.textButton} onClick={handleDeleteEmotion}>감정 삭제</span>
                </div>

                <div className={styles.calendarWrapper}>
                    <div className={styles.calendarHeaderRow}>
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                            <div key={i} className={styles.dayHeader}>{day}</div>
                        ))}
                    </div>

                    <div className={styles.calendarGrid}>
                        {days.map((date, idx) => {
                            const fullDate = date ? dayjs(new Date(currentMonth.year(), currentMonth.month(), date)) : null;
                            const dateKey = fullDate?.format('YYYY-MM-DD');
                            const emotion = emotionData[dateKey];
                            const post = postData[dateKey];

                            const handleEmojiClick = (e) => {
                                e.stopPropagation();
                                if (post?.postIds?.length > 0) {
                                    // 예: 새 탭으로 열기 (또는 모달 등)
                                    post.postIds.forEach((id) => window.open(`/mylibrary/post/${id}`, "_blank"));
                                }
                            };

                            return (
                                <div
                                    key={idx}
                                    className={`${styles.dayCell} 
      ${selectedDate && fullDate?.isSame(selectedDate, 'day') ? styles.selectedDay : ''} 
      ${fullDate?.isAfter(today, 'day') ? styles.disabledDay : ''}`}
                                    onClick={() => handleDateClick(date)}
                                    style={{ cursor: date && fullDate?.isAfter(today, 'day') ? 'not-allowed' : 'pointer' }}
                                >
                                    {/* 날짜 + 감정 (조건부 표시) */}
                                    <div>
                                        {date}
                                        {selectedTab !== '포스트' && emotion && ` ${emotion}`}
                                    </div>

                                    {/* 포스트 개수 + 이모지 (조건부 표시) */}
                                    {selectedTab !== '감정' && post?.count === 1 && (
                                        <div className={styles.postInfo} onClick={handleEmojiClick}>📙</div>
                                    )}
                                    {selectedTab !== '감정' && post?.count > 1 && (
                                        <div className={styles.postInfo} onClick={handleEmojiClick}>📚</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isModalOpen && (
                    <EmotionModal
                        onSelect={handleEmotionSelect}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
