import { NavLink } from 'react-router-dom';
import searchIcon from '../../assets/search.png';
import styles from './AdminFaqList.module.css';
function AdminFaqList() {
    return (
        <>
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>FAQ</span>
                    <div>
                        <button className={styles.writing}><NavLink to="/admin/faq/writing" className={styles.titlecolor}>글쓰기</NavLink></button>
                        <span className={styles.slash}>/</span>
                        <button className={styles.delete}>삭제</button>
                    </div>
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
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>0001</td>
                                    <td>Q1.알고리즘이 이상해요.</td>
                                    <td>Admin1</td>
                                    <td>2025-05-12</td>
                                    <td>삭제</td>
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

export default AdminFaqList;