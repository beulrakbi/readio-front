import React, { useState, useEffect } from 'react';
import styles from './MyLibrary.module.css';
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom";

const CalendarSection = () => {
    const today = dayjs();
    const year = today.year();
    const month = today.month(); // 0~11
    const navigate = useNavigate()
    const [emotionData, setEmotionData] = useState({});

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

    useEffect(() => {
        const fetchEmotions = async () => {
            const token = localStorage.getItem("accessToken");
            const userId = localStorage.getItem("userId");
            if (!token || !userId) return;

            try {
                const response = await fetch(`/api/user/emotions?userId=${userId}&year=${year}&month=${month + 1}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) return;

                const data = await response.json();
                const parsed = {};
                data.forEach(({ emotionCode, date }) => {
                    parsed[date] = convertLabelToEmoji(emotionCode);
                });
                setEmotionData(parsed);
                console.log("emotionData 확인:", parsed);
            } catch (err) {
                console.error("감정 조회 중 에러:", err);
            }
        };

        fetchEmotions();
    }, [year, month]);


    const getDaysArray = () => {
        const startDay = dayjs(new Date(year, month, 1)).day();
        const lastDate = dayjs(new Date(year, month + 1, 0)).date();
        const days = [];
        for (let i = 0; i < startDay; i++) days.push(null);
        for (let d = 1; d <= lastDate; d++) days.push(d);
        return days;
    };

    const days = getDaysArray();


    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{month + 1}월 활동 달력</h2>
                <span className={styles.sectionAction} onClick={()=>navigate('/mylibrary/calendar')}style={{cursor:'pointer'}}>
                    전체보기</span>
            </div>

            <div className={styles.calendarWrapper}>
                <div className={styles.calendarHeaderRow}>
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                        <div key={i} className={styles.dayHeader}>{day}</div>
                    ))}
                </div>


                <div className={styles.calendarGrid}>
                    {days.map((date, idx) => {
                        const fullDate = date ? dayjs(new Date(year, month, date)) : null;
                        const dateKey = fullDate?.format('YYYY-MM-DD');
                        const emoji = emotionData[dateKey];

                        return (
                            <div key={idx} className={styles.dayCell}>
                                {date}
                                <span>{emoji}</span> 
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarSection;
