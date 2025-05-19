import React, { useState } from 'react';
import styles from './Calendar.module.css';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import EmotionModal from './EmotionModal';

const CalendarPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emotionData, setEmotionData] = useState({}); // 날짜 → 감정 이모지 저장
    const handleRegisterEmotion = () => {
        if (!selectedDate) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }
        setIsModalOpen(true); // 모달 열기
    };
    const handleEmotionSelect = (emoji) => {
        const key = selectedDate.format('YYYY-MM-DD');
        setEmotionData((prev) => ({ ...prev, [key]: emoji }));
        setIsModalOpen(false);
    };


    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedTab, setSelectedTab] = useState('전체');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
    const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
    const today = dayjs();
    const handleDateClick = (date) => {
        if (!date) return;

        const fullDate = dayjs(new Date(currentMonth.year(), currentMonth.month(), date));

        // 오늘 이후는 선택 불가
        if (fullDate.isAfter(today, 'day')) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }

        // 이미 선택된 날짜를 다시 클릭하면 해제
        if (selectedDate && fullDate.isSame(selectedDate, 'day')) {
            setSelectedDate(null);
            return;
        }

        // 새 날짜 선택
        setSelectedDate(fullDate);
    };

    const handleDeleteEmotion = () => {
        if (!selectedDate) {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            return;
        }

        const key = selectedDate.format('YYYY-MM-DD');

        setEmotionData((prev) => {
            const updated = { ...prev };
            delete updated[key]; // 해당 날짜만 삭제
            return updated;
        });
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
            {showPopup && (
                <div className={styles.showPopup}>
                    날짜를 선택해주세요.
                </div>
            )}


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
                        const fullDate = date
                            ? dayjs(new Date(currentMonth.year(), currentMonth.month(), date))
                            : null;

                        const dateKey = fullDate?.format('YYYY-MM-DD');
                        const emotion = emotionData[dateKey];

                        return (
                            <div
                                key={idx}
                                className={`${styles.dayCell} 
                                ${selectedDate && fullDate?.isSame(selectedDate, 'day') ? styles.selectedDay : ''} 
                                ${fullDate?.isAfter(today, 'day') ? styles.disabledDay : ''}`}
                                onClick={() => handleDateClick(date)}
                                style={{ cursor: date && fullDate?.isAfter(today, 'day') ? 'not-allowed' : 'pointer' }}
                            >
                                {date} {emotion}
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

    );
};

export default CalendarPage;
