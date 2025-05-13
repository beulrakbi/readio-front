import { NavLink } from "react-router-dom";
import logo from "../../assets/MainPageNavLogo.png";
import styles from './AdminNavbar.module.css';

function AdminNavbar() {
     return (
          <div className={styles.Navbar}>
               <div className={styles.Nav}>
                    <img src={logo} className={styles.Logo} alt="Logo" /> 
                    <br />
                    <button className={styles.login}>로그인</button>
                    <hr />
                    <ul>회원 관리
                         <li>회원 목록</li>
                    </ul>
                    <hr />
                    <ul>신고 관리
                         <li>리뷰</li>
                         <li>포스트</li>
                    </ul>
                    <hr />
                    <ul>게시판 관리
                         <li><NavLink to="/admin/notice">공지사항</NavLink></li>
                         <li>소식</li>
                         <li><NavLink to="/admin/faq">FAQ</NavLink></li>
                         <li><NavLink to="/admin/qna">Q&A</NavLink></li>
                    </ul>
                    <hr />
                    <ul>사이트 관리
                         <li>영상 필터링 / 키워드</li>
                         <li>관심분야</li>
                    </ul>
               </div>
               <div className={styles.NavbarBox}></div>

          </div>
     );
}

export default AdminNavbar;
