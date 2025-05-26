import { NavLink } from 'react-router-dom';
import searchIcon from '../../assets/search2.png';
import styles from './EventList.module.css';
function EventList() {
  return (
    <>
      <div className={styles.bigContainer}>
        <div className={styles.smallHeader}>
          <span className={styles.smallHeaderElement}>소식 게시판</span>
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
              <span><NavLink to="/event/detail" className={styles.titlecolor}>소식 테스트중입니다.1</NavLink></span>
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
            <button className={styles.btn}><img src={searchIcon}/></button>
          </div>
          <div className={styles.pagingbox}>
            <p className={styles.num}>1 2 3 4 5</p>
          </div>
        </div>
      </div>
    </>
  );
}
export default EventList;