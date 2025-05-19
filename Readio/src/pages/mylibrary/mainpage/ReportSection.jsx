import React from 'react';
import styles from './MyLibrary.module.css';

const ReportSection = () => {
    return (
        <>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>활동 리포트</h2>
                    <span className={styles.sectionAction}>리포트 상세</span>
                </div>
            </div>

            <div className={styles.reportBox}>
                <h3 className={styles.reportHeadline}>이번달 독서 인사이트 한눈에 보기</h3>

                <ul className={styles.reportList}>
                    <li>📅 이번달 독서량: 5월 대비 ▲ 50% 증가</li>
                    <li>😊 가장 많이 기록한 감정: 기쁨</li>
                    <li>📚 가장 많이 북마크한 분야: 소설 &gt; 심리학 &gt; 자기계발</li>
                </ul>

                <p className={styles.reportNote}>
                    ** 자세한 그래프와 트렌드는 리포트 상세에서 확인할 수 있어요. **
                </p>
            </div>
        </>
    );
};

export default ReportSection;
