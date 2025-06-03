import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/MainPageNavLogo.png";
import styles from './AdminNavbar.module.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../modules/user/userSlice";

function AdminNavbar() {

     const navigate = useNavigate(); // useNavigate 훅 사용
     const dispatch = useDispatch(); // useDispatch 훅 사용

     // Redux 스토어에서 로그인 상태 가져오기
     const isLogin = useSelector((state) => state.user.isLogin);
     // 현재 로그인된 사용자의 역할도 필요하다면 가져올 수 있습니다.
     const userRole = useSelector((state) => state.user.userInfo?.userRole);

     // 로그아웃 핸들러
     const onClickLogoutHandler = () => {
          dispatch(logout()); // Redux 상태에서 로그아웃 처리
          navigate('/users/login', { replace: true }); // 로그인 페이지로
     };

     function AdminBeforeLogin() {
          return (
               <div className={styles.adminLoginButtons}> {/* 새로운 CSS 클래스 추가 고려 */}
                    <Link to="/users/login" className={styles.login}>로그인</Link>
               </div>
          );
     }

     function AdminAfterLogin() {
          // 아래 코드 없어도 되긴함
          if (!userRole || !userRole.includes("ADMIN")) {
               return null; // ADMIN 권한이 없으면 이 컴포넌트 자체를 렌더링하지 않음
          }
     }

     return (
          <div className={styles.Navbar}>
               <div className={styles.buttonBox}>
                    <img src={logo} className={styles.Logo} alt="Logo" />
                    <br />
                    <button onClick={onClickLogoutHandler} className={styles.login}>
                    로그아웃
                    </button>
                    {isLogin ? <AdminAfterLogin /> : <AdminBeforeLogin />}
               </div>
               <div className={styles.Nav}>
                    <hr className={styles.adminNavBarHr} />
                    <p className={styles.text1}>회원 관리</p>
                    <Link to="/admin/users/list" className={styles.text2}>• 회원 목록</Link>
                    <hr className={styles.adminNavBarHr} />
                    <p className={styles.text1}>신고 관리</p>
                    <Link to="/admin/reported/review" className={styles.text2}>• 리뷰</Link>
                    <Link to="/admin/reported/post" className={styles.text2}>• 포스트</Link>
                    <hr className={styles.adminNavBarHr} />
                    <p className={styles.text1}>게시판 관리</p>
                    <Link to="/admin/notice" className={styles.text2}>• 공지사항</Link>
                    <Link to="/" className={styles.text2}>• 소식</Link>
                    <Link to="/admin/faq" className={styles.text2}>• FAQ</Link>
                    <Link to="/admin/qna" className={styles.text2}>• Q&A</Link>
                    <hr className={styles.adminNavBarHr} />
                    <p className={styles.text1}>사이트 관리</p>
                    <Link to="/admin/filtering" className={styles.text2}>• 영상 필터링 / 키워드</Link>
                    <Link to="/admin/curation" className={styles.text2}>• 영상 키워드 관리</Link>
                    <Link to="/admin/interest" className={styles.text2}>• 관심분야</Link>
               </div>
          </div>
     );
}

export default AdminNavbar;
