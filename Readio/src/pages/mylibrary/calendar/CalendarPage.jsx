import React, { useState } from 'react';
import styles from './Calendar.module.css';
import dayjs from 'dayjs';

const CalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedTab, setSelectedTab] = useState('전체');

    const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
    const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

    const today = dayjs();
    const year = today.year();
    const month = today.month(); // 0~11

    const getDaysArray = () => {
        const startDay = dayjs(new Date(currentMonth.year(), currentMonth.month(), 1)).day();
        const lastDate = dayjs(new Date(currentMonth.year(), currentMonth.month() + 1, 0)).date();
        const days = [];

        for (let i = 0; i < startDay; i++) days.push(null);
        for (let d = 1; d <= lastDate; d++) days.push(d);

        return days;
    };
    const days = getDaysArray();

    return(
        <div className={styles.wrapper}>
            <h2 className={styles.title}>&lt; 뒤로가기</h2>
            <h2 className={styles.subtitle}>
                <button onClick={handlePrevMonth} className={styles.triangleBtn + ' ' + styles.left}></button>
                {currentMonth.format('YYYY년 M월 활동 달력')}
                <button onClick={handleNextMonth} className={styles.triangleBtn + ' ' + styles.right}></button>
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
            <div className={styles.block}></div>
            <div className={styles.section}>
                <div className={styles.calendarWrapper}>
                    <div className={styles.calendarHeaderRow}>
                        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                            <div key={i} className={styles.dayHeader}>{day}</div>
                        ))}
                    </div>

                    <div className={styles.calendarGrid}>
                        {days.map((date, idx) => (
                            <div key={idx} className={styles.dayCell}>
                                {date || ''}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}
export default CalendarPage;