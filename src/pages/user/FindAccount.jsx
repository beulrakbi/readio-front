import { Route, Link, useLocation, Routes, Navigate, Outlet } from 'react-router-dom';
import styles from './FindAccount.module.css';

const FindAccount = () => {
  const location = useLocation();
  
  return (
 <div className={styles.container}>
      <h2>계정정보 찾기</h2>

      {/* 탭 버튼 */}
      <div className={styles.tabs}>
        <Link to="find-id" className={location.pathname === '/find-account/find-id' ? styles.active : ''}>아이디 찾기</Link>
        <Link to="find-pwd" className={location.pathname === '/find-account/find-pwd' ? styles.active : ''}>비밀번호 찾기</Link>
      </div>

      {/* 자식 컴포넌트가 여기서 렌더됨 */}
      <Outlet />
    </div>
  );
};

const FindIdForm = () => (
  <div className={styles.formContainer}>

 <div className={styles.tableForm}>
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.labelCell}`}>이름</div>
        <div className={`${styles.tableCell} ${styles.inputCell}`}>
          <input type="text" placeholder="이름 입력" />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.labelCell}`}>휴대폰번호</div>
        <div className={`${styles.tableCell} ${styles.inputCell}`}>
          <input type="text" placeholder="휴대폰번호 입력" />
        </div>
      </div>
    </div>

    <button className={styles.button}>확인</button>
  </div>
);

const FindPwdForm = () => (
  <div className={styles.formContainer}>

        <div className={styles.tableForm}>
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.labelCell}`}>아이디</div>
        <div className={`${styles.tableCell} ${styles.inputCell}`}>
          <input type="text" placeholder="아이디 입력" />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.labelCell}`}>이메일</div>
        <div className={`${styles.tableCell} ${styles.inputCell}`}>
          <input type="email" placeholder="이메일 입력" />
          <button className={styles.verifyButton}>
            인증번호 발송
          </button>
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.labelCell}`}>인증번호 확인</div>
        <div className={`${styles.tableCell} ${styles.inputCell} ${styles.verifyRow}`}>
          <input type="text" placeholder="인증번호 입력" />
        </div>
      </div>
    </div>

    <button className={styles.button}>확인</button>
  </div>
);

export default FindAccount;
export { FindIdForm, FindPwdForm };