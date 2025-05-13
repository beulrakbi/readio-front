import React from 'react';
import styles from './MyLibraryGuest.module.css'
import dayjs from "dayjs";

function MyLibraryGuestPage() {
    const today = dayjs();
    const year = today.year();
    const month = today.month(); // 0~11

    const getDaysArray = () => {
        const startDay = dayjs(new Date(year, month, 1)).day();
        const lastDate = dayjs(new Date(year, month + 1, 0)).date();
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let d = 1; d <= lastDate; d++) {
            days.push(d);
        }

        return days;
    };

    const days = getDaysArray();

    return (
        <>
            <div className={styles.pageWrapper}>
            <div className={styles.profileCard}>
                <div className={styles.profileImage}></div> {/* 회색 원형 div */}

                <div className={styles.profileInfo}>
                    <h2 className={styles.nickname}>미등록 사용자</h2>
                    <p>등급 :</p>
                    <p>팔로워 ・ 팔로잉</p>
                </div>
            </div>

            <div className={styles.outProfileInfo}>
                <div className={styles.stats}>
                    <div className={styles.statItem}><strong>0</strong><span>포스트</span></div>
                    <div className={styles.statItem}><strong>0</strong><span>리뷰</span></div>
                    <div className={styles.statItem}><strong>0</strong><span>관심 영상</span></div>
                    <div className={styles.statItem}><strong>0</strong><span>관심 책</span></div>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.postBtn}>+ 포스트 작성하기</button>
                    <button className={styles.interestBtn}>📌 나의 관심사</button>
                </div>
            </div>

            <hr className={styles.sectionDivider} />

            {/* 영상 섹션 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>영상</h2>
                    <span className={styles.sectionAction}>전체보기</span>
                </div>
                <div className={styles.videoBookmarkList}>
                    <div className={styles.videoBookmark}></div>
                    <div className={styles.videoBookmark}></div>
                    <div className={styles.videoBookmark}></div>
                </div>
            </div>

            {/* 도서 섹션 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>도서</h2>
                    <span className={styles.sectionAction}>전체보기</span>
                </div>
                <div className={styles.bookmarkList}>
                    <div className={styles.bookmark}></div>
                    <div className={styles.bookmark}></div>
                    <div className={styles.bookmark}></div>
                </div>
            </div>

            {/* 활동 달력 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{month + 1}월 활동 달력</h2>
                    <span className={styles.sectionAction}>전체보기</span>
                </div>
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

            {/* 활동 리포트 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>활동 리포트</h2>
                    <span className={styles.sectionAction}>리포트 상세</span>
                </div>
            </div>
            </div>
        </>
    );
}

export default MyLibraryGuestPage;
