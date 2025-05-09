import styles from './NoticeDetail.module.css';

function NoticeDetail() {
    return (
        <>
            <div className={styles.bigContainer}>
                <div>
                    <p className={styles.sort}>공지사항</p>
                    <p className={styles.title}>공지사항 테스트중입니다.1</p>
                </div>
                <div className={styles.line}></div>
                <div className={styles.nameBox}>
                    <span className={styles.userId}>admin1</span>
                    <span className={styles.role}>관리자</span>
                </div>
                <div>
                    <span className={styles.date}>2025.04.25 13:23</span>
                    <span className={styles.view}>조회수 1</span>
                </div>
                <div className={styles.line2}></div>
                <div className={styles.contentBox}>
                    <p>안녕하시렵니까?</p>
                    <p>저는 황재용입니다.</p>
                    <p>일단은 지금 테스트중입니다.</p>
                    <p>아오 귀찮다?</p>
                    <p>안녕하시렵니까?</p>
                    <p>저는 황재용입니다.</p>
                    <p>일단은 지금 테스트중입니다.</p>
                    <p>아오 귀찮다?</p>
                    <p>안녕하시렵니까?</p>
                    <p>저는 황재용입니다.</p>
                    <p>일단은 지금 테스트중입니다.</p>
                    <p>아오 귀찮다?</p>
                    <p>안녕하시렵니까?</p>
                    <p>저는 황재용입니다.</p>
                    <p>일단은 지금 테스트중입니다.</p>
                    <p>아오 귀찮다?</p>
                    <p>안녕하시렵니까?</p>
                    <p>저는 황재용입니다.</p>
                    <p>일단은 지금 테스트중입니다.</p>
                    <p>아오 귀찮다?</p>
                </div>
                <div className={styles.copyLink}>
                    <button>링크 복사</button>
                </div>
            </div>
        </>
    )
}
export default NoticeDetail;

