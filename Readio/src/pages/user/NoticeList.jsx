import styles from './NoticeList.module.css'; // .module.css로 변경

function NoticeList() {
  return (
    <>
    <div className={styles.backgroundTexture}>
      <div className={styles.bigContainer}>
        <div className={styles.smallHeader}>
          <span className={styles.smallHeaderElement}>공지사항 게시판</span>
          <div>
            <button className={styles.writing}>글쓰기</button>
            <span className={styles.slash}>/</span>
            <button className={styles.writing}>내가 쓴 글</button>
          </div>
        </div>
        <div className={styles.line}></div>
        <ul className={styles.board}>
          <li className={styles.boardLi}>
            <span>게시글 번호</span>
            <span>제목</span>
            <div className={styles.boardLi2}>
              <span>작성자</span>
              <span>작성일</span>
              <span>조회수</span>
            </div>
          </li>
          <li className={styles.postLi}>
            <span>0001</span>
            <div className={styles.postContext}>
              <span>공지사항 테스트중입니다.1</span>
            </div>
            <div className={styles.postLi2}>
              <span>admin1</span>
              <span>2025/05/03</span>
              <span>1</span>
            </div>
          </li>
          <li className={styles.postLi}>
            <span>0001</span>
            <div className={styles.postContext}>
              <span>공지사항 테스트중입니다.1</span>
            </div>
            <div className={styles.postLi2}>
              <span>admin1</span>
              <span>2025/05/03</span>
              <span>1</span>
            </div>
          </li>
          <li className={styles.postLi}>
            <span>0001</span>
            <div className={styles.postContext}>
              <span>공지사항 테스트중입니다.1</span>
            </div>
            <div className={styles.postLi2}>
              <span>admin1</span>
              <span>2025/05/03</span>
              <span>1</span>
            </div>
          </li>
          <li className={styles.postLi}>
            <span>0001</span>
            <div className={styles.postContext}>
              <span>공지사항 테스트중입니다.1</span>
            </div>
            <div className={styles.postLi2}>
              <span>admin1</span>
              <span>2025/05/03</span>
              <span>1</span>
            </div>
          </li>
        </ul>
        <div className={styles.mcontainer}>
          <div className={styles.textcontainer}>
            <input className={styles.textbox} type="text" placeholder="검색어를 입력해주세요." />
            <button className={styles.btn}>클릭</button>
          </div>
          <div className={styles.pagingbox}>
            <p className={styles.num}>1 2 3 4 5</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
// 아
export default NoticeList;