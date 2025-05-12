import styles from './QnaWriting.module.css';
function QnaWriting() {
    return (
        <>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>Q&A 게시판</span>
                </div>
                <div className={styles.line}></div>
                <div className={styles.titleBox}>
                    <input type="text" className={styles.textTitle} placeholder='제목을 입력하세요.'/>
                </div>
                <div className={styles.contentBox}>
                    <textarea className={styles.textAreaBox} placeholder='내용을 입력하세요.'></textarea>
                </div>
                <div className={styles.btnBox}>
                    <button className={styles.btn}>등록</button>
                    <button className={styles.btn}>취소</button>
                </div>
            </div>
        </>
    );
}
export default QnaWriting;