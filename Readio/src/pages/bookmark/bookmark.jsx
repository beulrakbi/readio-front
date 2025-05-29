import { useState } from 'react';
import styles from './Bookmark.module.css';

function Bookmark() {
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'video'

  // 아이템 목록 상태로 관리 (삭제 가능하도록)
  const [items, setItems] = useState({
    book: [
      { id: 1, title: '역행자', subtitle: '저자 : 재용' },
      { id: 2, title: '개미1', subtitle: '저자 : 재용' },
    ],
    video: [
      { id: 3, title: '죽기 전에 꼭 읽어야 할 책 TOP5', subtitle: '채널명 : 용튜브' },
      { id: 4, title: '죽으면 꼭 읽어야 할 책 TOP5', subtitle: '채널명 : 용튜브' },
    ],
  });

  // 삭제 함수
  const deleteItem = (tab, id) => {
    setItems((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((item) => item.id !== id),
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
            책 {items.book.length}
          </button>
        </div>
        <div className={styles.tabButtonWrapper}>
          <button
            className={`${styles.tabButton} ${activeTab === 'video' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('video')}
          >
            영상 {items.video.length}
          </button>
        </div>
      </div>

      {activeTab === 'book'
        ? items.book.map((item) => (
            <div key={item.id} className={styles.bookmarkItem}>
              <div className={styles.imgbox}></div>
              <div className={styles.bookmarkInfo}>
                <li className={styles.bookmarkTitle}>{item.title}</li>
                <li className={styles.bookmarkSubtitle}>{item.subtitle}</li>
              </div>
              <button
                className={styles.bookmarkActionButton}
                onClick={() => deleteItem('book', item.id)}
              >
                삭제
              </button>
            </div>
          ))
        : items.video.map((item) => (
            <div key={item.id} className={styles.bookmarkItem}>
              <div className={styles.videoBox}></div>
              <div className={styles.bookmarkInfo}>
                <li className={styles.bookmarkTitle}>{item.title}</li>
                <li className={styles.bookmarkSubtitle}>{item.subtitle}</li>
              </div>
              <button
                className={styles.bookmarkActionButton}
                onClick={() => deleteItem('video', item.id)}
              >
                삭제
              </button>
            </div>
          ))}
    </div>
  );
}

export default Bookmark;
