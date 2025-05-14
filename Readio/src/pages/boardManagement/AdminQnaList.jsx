import { NavLink } from 'react-router-dom';
import searchIcon from '../../assets/search.png';
import styles from './AdminQnaList.module.css';
function AdminQnaList() {
    return (
        <>
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>Q&A </span>
                </div>
                <div className={styles.line}></div>
                <div className={styles.tableBox}>
                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>번호</th>
                                <th className={styles.titleSize}>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>0001</td>
                                    <td><NavLink to="/admin/qna/detail" className={styles.contentBtn}>질문 테스트입니다.</NavLink></td>
                                    <td>user1</td>
                                    <td>2025-05-12</td>
                                    <td>55</td>
                                    <td>
                                        <button className={styles.answer}><NavLink to="/admin/qna/answer" className={styles.answerbtn}>답변</NavLink></button>
                                        /
                                        <button className={styles.delete}>삭제</button>    
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
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
        </div>
        </>
    );
}

export default AdminQnaList;
