import logo from "../../assets/img/MainPageNavLogo.png";
import styles from '../common/AdminNavbar.module.css';

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
                         <li>공지사항</li>
                         <li>소식</li>
                         <li>FAQ</li>
                         <li>Q&A</li>
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
