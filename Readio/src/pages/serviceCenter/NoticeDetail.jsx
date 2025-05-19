import styles from './NoticeDetail.module.css';
function NoticeDetail() {
    return (
        <>
            <div className={styles.bigContainer}>
                    <p className={styles.sort}>공지사항</p>
                <div>
                    <p className={styles.title}>공지사항 테스트중입니다.1</p>
                </div>
                <div className={styles.line}></div>
                <div className={styles.nameBox}>
                    <span className={styles.userId}>admin1</span>
                    <span className={styles.role}>관리자</span>
                </div>
                <div>
                    <span className={styles.date}>2025.04.25 13:23</span>
                    <span className={styles.view}>조회 1</span>
                </div>
                <div className={styles.line2}></div>
                <div className={styles.contentBox}>
                    <p>안녕하시렵니까?</p>
                </div>
                <div className={styles.copyLink}>
                    <button className={styles.btn}>링크 복사</button>
                </div>
                <div className={styles.line2}></div>
                <div className={styles.listBox}>
                    <div className={styles.noticeBoard}>
                        <p>공지사항 게시판</p>
                    </div>
                    <div className={styles.list}>
                        <ul>
                            <li>
                                <span>[단기]</span>
                                <span>공지사항 테스트중입니다.1</span>
                                <span>admin1</span>
                                <span>2025.04.25</span>
                            </li>
                            <li>
                                <span>[단기]</span>
                                <span>공지사항 테스트중입니다.2</span>
                                <span>admin1</span>
                                <span>2025.04.25</span>
                            </li>
                            <li>
                                <span>[단기]</span>
                                <span>공지사항 테스트중입니다.3</span>
                                <span>admin1</span>
                                <span>2025.04.25</span>
                            </li>
                            <li>
                                <span>[긴급]</span>
                                <span>공지사항 테스트중입니다.4</span>
                                <span>admin1</span>
                                <span>2025.04.25</span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.num}>1 2 3 4 5 6</div>
                </div>
            </div>
        </>
    )
}
export default NoticeDetail;

