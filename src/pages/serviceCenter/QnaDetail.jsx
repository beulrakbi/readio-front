import styles from './QnaDetail.module.css';

function QnaDetail() {
    return (
        <>
            <div className={styles.bigContainer}>
                <div>
                    <p className={styles.sort}>Q&A 게시판</p>
                    <div className={styles.updateAndDelete}>
                        <p className={styles.title}>질문 게시판 테스트중입니다.1</p>
                        <div className={styles.btnBox}>
                            <span className={styles.updateBtn}>수정</span>
                            <span className={styles.slash}>/</span>
                            <span className={styles.deleteBtn}>삭제</span>
                        </div>
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.nameBox}>
                    <span className={styles.userId}>User4</span>
                    <span className={styles.role}>일반 회원</span>
                </div>
                <div>
                    <span className={styles.date}>2025.04.25 13:23</span>
                    <span className={styles.view}>조회 1</span>
                </div>
                <div className={styles.line2}></div>
                <div className={styles.contentBox}>
                    <p>안녕하시렵니까?</p>
                </div>
                <p className={styles.sort}>답변</p>
                <div className={styles.line2}></div>
                <div className={styles.qnaAnswer}>
                    <p>처리중입니다.</p>
                </div>
                <div></div>
                <div className={styles.copyLink}>
                    <button className={styles.btn}>링크 복사</button>
                </div>
                <div className={styles.line2}></div>
                <div className={styles.listBox}>
                    <div className={styles.noticeBoard}>
                        <p>Q&A 게시판</p>
                    </div>
                    <div className={styles.list}>
                        <ul>
                            <li>
                                <span>[단기]</span>
                                <span>Q&A 테스트중입니다.1</span>
                                <span>user1</span>
                                <span>2025.04.25</span>
                            </li>
                            <li>
                                <span>[단기]</span>
                                <span>Q&A 테스트중입니다.2</span>
                                <span>user1</span>
                                <span>2025.04.25</span>
                            </li>
                            <li>
                                <span>[단기]</span>
                                <span>Q&A 테스트중입니다.3</span>
                                <span>user1</span>
                                <span>2025.04.25</span>
                            </li>
                            <li>
                                <span>[긴급]</span>
                                <span>Q&A 테스트중입니다.4</span>
                                <span>user1</span>
                                <span>2025.04.25</span>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.num}>1 2 3 4 5 6</div>
                </div>
            </div>
        </>
    );
}
export default QnaDetail;