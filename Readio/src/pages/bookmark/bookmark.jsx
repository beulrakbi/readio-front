import styles from './Bookmark.module.css';

const Bookmark = () => {
  return (
    <div className={styles.container}>
      <p className={styles.backLink}>{'< cOWsun'}</p>
      <div className={styles.tabs}>
        <span className={styles.tab}>책</span>
        <span className={styles.tab}>영상</span>
      </div>
      <hr className={styles.divider} />
    </div>
  );
};

export default Bookmark;