import { useState } from 'react';
import styles from './Bookmark.module.css';

function Bookmark() {
    const [activeTab, setActiveTab] = useState('book'); // 'book' or 'video'

    const [bookmarkState, setBookmarkState] = useState({
        '강적99': false,
        '토리_tory': false
    });

    const toggleBookmark = (item) => {
        setBookmarkState((prev) => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    return (
        <div className={styles.bookmarkContainer}>
            <button className={styles.backButton}>&lt; cOwsun</button>

            <div className={styles.tabContainer}>
                <div className={styles.tabButtonWrapper}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'book' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('book')}
                    >
                        책 2
                    </button>
                </div>
                <div className={styles.tabButtonWrapper}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'video' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('video')}
                    >
                        영상 4
                    </button>
                </div>
            </div>

            {activeTab === 'book' ? (
                <>
                    <div className={styles.bookmarkItem}>
                        <div className={styles.imgbox}></div>
                        <div className={styles.bookmarkInfo}>
                            <li className={styles.bookmarkTitle}>역행자</li>
                            <li className={styles.bookmarkSubtitle}>저자 : 재용</li>
                        </div>
                        <button
                            className={`${styles.bookmarkActionButton} ${bookmarkState["역행자"] ? styles.bookmarked : ''}`}
                            onClick={() => toggleBookmark("역행자")}
                        >
                            {bookmarkState["역행자"] ? '등록' : '삭제'}
                        </button>
                    </div>
                    <div className={styles.bookmarkItem}>
                        <div className={styles.imgbox}></div>
                        <div className={styles.bookmarkInfo}>
                            <li className={styles.bookmarkTitle}>개미1</li>
                            <li className={styles.bookmarkSubtitle}>저자 : 재용</li>
                        </div>
                        <button
                            className={`${styles.bookmarkActionButton} ${bookmarkState["개미1"] ? styles.bookmarked : ''}`}
                            onClick={() => toggleBookmark("개미1")}
                        >
                            {bookmarkState["개미1"] ? '등록' : '삭제'}
                        </button>
                    </div>
                </> 
            ) : (
                <>
                    <div className={styles.bookmarkItem}>
                        <div className={styles.videoBox}></div>
                        <div className={styles.bookmarkInfo}>
                            <li className={styles.bookmarkTitle}>죽기 전에 꼭 읽어야 할 책 TOP5</li>
                            <li className={styles.bookmarkSubtitle}>채널명 : 용튜브</li>
                        </div>
                        <button
                            className={`${styles.bookmarkActionButton} ${bookmarkState["죽기 전에 꼭 읽어야 할 책 TOP5"] ? styles.bookmarked : ''}`}
                            onClick={() => toggleBookmark("죽기 전에 꼭 읽어야 할 책 TOP5")}
                        >
                            {bookmarkState["죽기 전에 꼭 읽어야 할 책 TOP5"] ? '등록' : '삭제'}
                        </button>
                    </div>
                    <div className={styles.bookmarkItem}>
                        <div className={styles.videoBox}></div>
                        <div className={styles.bookmarkInfo}>
                            <li className={styles.bookmarkTitle}>죽으면 꼭 읽어야 할 책 TOP5</li>
                            <li className={styles.bookmarkSubtitle}>채널명 : 용튜브</li>
                        </div>
                        <button
                            className={`${styles.bookmarkActionButton} ${bookmarkState["죽으면 꼭 읽어야 할 책 TOP5"] ? styles.bookmarked : ''}`}
                            onClick={() => toggleBookmark("죽으면 꼭 읽어야 할 책 TOP5")}
                        >
                            {bookmarkState["죽으면 꼭 읽어야 할 책 TOP5"] ? '등록' : '삭제'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Bookmark;
