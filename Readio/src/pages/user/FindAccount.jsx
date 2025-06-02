import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './FindAccount.module.css';
import { useState } from 'react';

const FindAccount = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <h2 className={styles.FindAccountTitle}>계정정보 찾기</h2>

      {/* 탭 버튼 */}
      <div className={styles.tabs}>
        <Link to="/account/findid"
          className={location.pathname.includes('findid') ? styles.active : ''}>
          아이디 찾기
        </Link>

        <Link to="/account/findpwd"
          className={location.pathname.includes('findpwd') ? styles.active : ''}>
          비밀번호 찾기
        </Link>
      </div>
      {/* 자식 컴포넌트가 여기서 렌더됨 */}
      <Outlet />
    </div>
  );
};

const FindIdForm = () => {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState('');

  const handleFindId = async () => {
    try {
      const response = await fetch(`/api/member/findId?name=${name}&phone=${phone}`);
      if (response.ok) {
        const data = await response.text();
        setResult(`아이디: ${data}`);
      } else {
        setResult('일치하는 계정이 없습니다.');
      }
    } catch (error) {
      setResult('오류 발생');
    }
  };


  return (

    <div className={styles.formContainer}>

      <div className={styles.tableForm}>
        <div className={styles.tableRow}>
          <div className={`${styles.tableCell} ${styles.labelCell}`}>이름</div>
          <div className={`${styles.tableCell} ${styles.inputCell}`}>
            <input type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="이름 입력" />
          </div>
        </div>
        <div className={styles.tableRow}>
          <div className={`${styles.tableCell} ${styles.labelCell}`}>휴대폰번호</div>
          <div className={`${styles.tableCell} ${styles.inputCell}`}>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="휴대폰번호 입력" />
          </div>
        </div>
      </div>

      <button className={styles.button}>확인</button>
    </div>
  );
}


const FindPwdForm = () => {

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const sendCode = async () => {
    const response = await fetch('/api/member/sendCode', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.text();
    setSentCode(data);
    alert(`인증번호: ${data}`); // 실제 배포시 이메일로 전송
  };

  const verifyAndNext = async () => {
    if (code !== sentCode) {
      alert('인증번호 불일치');
      return;
    }
    const response = await fetch('/api/member/verifyUser', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email })
    });
    if (response.ok) {
      setStep(2);
    } else {
      alert('아이디와 이메일이 일치하지 않습니다');
    }
  };

  const resetPassword = async () => {
    await fetch('/api/member/resetPassword', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword })
    });
    alert('비밀번호 재설정 완료');
    window.location.href = '/login'; // 로그인 페이지로 이동
  };



  return (
    <div className={styles.formContainer}>
      {step === 1 && (
        <>
          <div className={styles.tableForm}>
            <div className={styles.tableRow}>
              <div className={`${styles.tableCell} ${styles.labelCell}`}>아이디</div>
              <div className={`${styles.tableCell} ${styles.inputCell}`}>
                <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="아이디 입력" />
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={`${styles.tableCell} ${styles.labelCell}`}>이메일</div>
              <div className={`${styles.tableCell} ${styles.inputCell}`}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일 입력" />
                <button className={styles.verifyButton} onClick={sendCode}>인증번호 발송</button>
              </div>
            </div>
            <div className={styles.tableRow}>
              <div className={`${styles.tableCell} ${styles.labelCell}`}>인증번호 확인</div>
              <div className={`${styles.tableCell} ${styles.inputCell} ${styles.verifyRow}`}>
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="인증번호 입력" />
              </div>
            </div>
          </div>
          <button className={styles.button} onClick={verifyAndNext}>확인</button>
        </>
      )}
      {step === 2 && (
        <>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="새 비밀번호 입력" />
          <button className={styles.button} onClick={resetPassword}>비밀번호 재설정</button>
        </>
      )}
    </div>
  );
}

export default FindAccount;
export { FindIdForm, FindPwdForm };

