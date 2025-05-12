import React from 'react';
import styles from './MyLibrary.module.css'

const BookmarkSection = () => {
    return (
        <>
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>영상</h2>
                <span className={styles.sectionAction}>전체보기</span>
            </div>

            <div className={styles.videoBookmarkList}>
                <div className={styles.videoBookmark }></div>
                <div className={styles.videoBookmark }></div>
                <div className={styles.videoBookmark }></div>
            </div>
        </div>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>도서</h2>
                    <span className={styles.sectionAction}>전체보기</span>
                </div>

                <div className={styles.bookmarkList}>
                    <div className={styles.bookmark }></div>
                    <div className={styles.bookmark }></div>
                    <div className={styles.bookmark }></div>
                    <div className={styles.bookmark }></div>
                    <div className={styles.bookmark }></div>

                </div>
            </div>
        </>
    )

};
export default BookmarkSection;