import { Link } from "react-router-dom";
import logo from "../../assets/MainPageNavLogo.png";
import styles from './AdminNavbar.module.css';

function AdminNavbar() {
     return (
          <div className={styles.Navbar}>
               <div className={styles.buttonBox}>

                    <img src={logo} className={styles.Logo} alt="Logo" /> 
                    <br />
                    <button className={styles.login}>로그인</button>
               </div>
               <div className={styles.Nav}>
                    <hr />
                    <p className={styles.text1}>회원 관리</p>
                    <Link to="/" className={styles.text2}>• 회원 목록</Link>
                    <hr />
                    <p className={styles.text1}>신고 관리</p>
                    <Link to="/admin/reported/review/list" className={styles.text2}>• 리뷰</Link>
                    <Link to="/admin/reported/post/list" className={styles.text2}>• 포스트</Link>
                    <hr />
                    <p className={styles.text1}>게시판 관리</p>
                    <Link to="/admin/notice" className={styles.text2}>• 공지사항</Link>
                    <Link to="/" className={styles.text2}>• 소식</Link>
                    <Link to="/admin/faq" className={styles.text2}>• FAQ</Link>
                    <Link to="/admin/qna" className={styles.text2}>• Q&A</Link>
                    <hr />
                    <p className={styles.text1}>사이트 관리</p>
                    <Link to="/admin/filtering/list" className={styles.text2}>• 영상 필터링 / 키워드</Link>
                    <Link to="/" className={styles.text2}>• 관심분야</Link>
               </div>
          </div>
     );
}

export default AdminNavbar;
