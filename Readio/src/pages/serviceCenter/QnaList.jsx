import { NavLink } from 'react-router-dom';
import Pagination from '../../components/board/common/Pagination';
import Search from '../../components/board/common/search';
import styles from './QnaList.module.css';
function QnaList() {
    return (
        <>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>Q&A 게시판</span>
                    <div>
                        <button className={styles.writing}><NavLink to="/qna/writing" className={styles.writing}>글쓰기</NavLink></button>
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
                            <span><NavLink to="/qna/detail" className={styles.titlecolor}>질문 게시판 테스트중입니다.1</NavLink></span>
                        </div>
                        <div className={styles.postLi2}>
                            <span>admin1</span>
                            <span>2025/05/03</span>
                            <span>1</span>
                        </div>
                    </li>
                </ul>
                <div className={styles.mcontainer}>
                    <Search/>
                    <Pagination/>
                </div>
            </div>
        </>
    );
}
export default QnaList;