import React from 'react';
import styles from './MyLibrary.module.css';
import dayjs from 'dayjs';

const CalendarSection = () => {
    const today = dayjs();
    const year = today.year();
    const month = today.month(); // 0~11

    const getDaysArray = () => {
        const startDay = dayjs(new Date(year, month, 1)).day(); // 요일 (0~6)
        const lastDate = dayjs(new Date(year, month + 1, 0)).date(); // 마지막 일자
        const days = [];

        // 빈 칸 (1일 전까지)
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // 실제 날짜
        for (let d = 1; d <= lastDate; d++) {
            days.push(d);
        }

        return days;
    };

    const days = getDaysArray();

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{month + 1}월 활동 달력</h2>
                <span className={styles.sectionAction}>전체보기</span>
            </div>
            <div className={styles.calendarGrid}>
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                    <div key={i} className={`${styles.dayHeader}` }>
                        {day}
                    </div>
                ))}

                {days.map((date, idx) => (
                    <div key={idx} className={styles.dayCell}>
                        {date || ''}
                    </div>
                ))}
            </div>
        </div>


    );
};

export default CalendarSection;
