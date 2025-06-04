import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './FindAccount.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const FindAccount = () => {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <h2 className={styles.FindAccountTitle}>계정정보 찾기</h2>

      {/* 탭 버튼 */}
      <div className={styles.tabs}>
        <Link to="/account/findId"
          className={location.pathname.includes('findId') ? styles.active : ''}>
          아이디 찾기
        </Link>

        <Link to="/account/findPwd"
          className={location.pathname.includes('findPwd') ? styles.active : ''}>
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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFindId = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('이름과 휴대폰 번호를 모두 입력해 주세요.');
      return;  // 서버 요청 중단
    }

    try {
      const response = await fetch(`http://localhost:8080/users/account/findId?name=${name}&phone=${phone}`);
      if (response.ok) {
        const data = await response.text();
        setResult(`아이디: ${data}`);
        setIsSuccess(true);
      } else {
        setResult('일치하는 계정이 없습니다.');
        setIsSuccess(false);
        alert('이름과 휴대폰 번호가 일치하지 않습니다.');
      }
    } catch (error) {
      setResult('오류 발생');
      setIsSuccess(false);
      alert('오류가 발생했습니다.');
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



      <div className={styles.resultContainer}>

        <button className={styles.button} onClick={handleFindId}>확인
        </button>
        {/*결과*/}

        <div className={styles.resultBox}>
          {result && (
            <>
              {isSuccess && (
                <p className={styles.resultMessage}>입력하신 정보와 일치하는 결과입니다.</p>
              )}
              <hr className={styles.line2} />
              <div className={styles.result}>{result}</div>
            </>
          )}
        </div>  {/*resultBox끝*/}

        {isSuccess && (
          <div className={styles.extraButtons}>
            <Link to="/users/login" className={styles.linkButton}>
              로그인하러가기
            </Link>
          </div>
        )}

      </div>    {/*resultContainer*/}




    </div>
  );
}

{/* -------------------아래부터 비밀번호 찾기------------------- */ }

const FindPwdForm = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const passwordInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    if (timer > 0 && sentCode && !isCodeVerified) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, sentCode, isCodeVerified]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const validatePassword = (value) => {
    const lengthValid = /^.{8,20}$/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const types = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    return lengthValid && types >= 2;
  };

  /* 인증번호 발송 */
  const sendCode = async () => {
    setMessage('');
    setError('');
    setIsCodeVerified(false);

    if (!userId.trim()) {
      alert('아이디를 먼저 입력해주세요.')
      setError('아이디를 먼저 입력해주세요.');
      return;
    }
    try {
      const res = await axios.post('/api/email/sendCode', {
        userId,
        email
      });

      setSentCode(res.data);
      console.log(res.data);
      alert('인증번호 발송이 완료되었습니다.');
      setTimer(1800);
      // setMessage('인증번호가 이메일로 전송되었습니다.');
    } catch (err) {
      console.log(err)
      const errorMessage = err.response?.data?.message || '인증번호 전송 실패';
      alert(errorMessage); // 여기서 알럿으로 보여줌
      setError(errorMessage);
    }
  };

  /* 인증번호 확인 */
  const verifyCode = () => {
    setMessage('');
    setError('');

    if (!code.trim()) {
      alert('인증번호를 입력해주세요.');
      setError('인증번호를 입력해주세요.');
      return;
    }

    if (code === sentCode) {
      setIsCodeVerified(true);
      setTimer(0);  // 타이머 멈추기
      // setMessage('인증번호가 확인되었습니다.');
      alert('인증번호 확인이 완료되었습니다.')
      passwordInputRef.current?.focus();
    } else {
      alert('인증번호가 일치하지 않습니다. 다시 시도해주세요.')
      setError('인증번호가 일치하지 않습니다.');
    }
  };

  /* 비밀번호 재설정 */
  const resetPassword = async () => {
    setMessage('');
    setError('');

    if (!userId.trim() || !email.trim()) {
      alert('아이디와 이메일을 입력해주세요.');
      setError('아이디와 이메일을 입력해주세요.');
      return;
    }

    if (!isCodeVerified) {
      setError('인증번호 확인이 필요합니다.');
      return;
    }

    if (!validatePassword(newPassword)) {
      alert('비밀번호는 8~20자, 영문/숫자/특수문자 중 2가지 이상 조합이어야 합니다.')
      setError('비밀번호는 8~20자, 영문/숫자/특수문자 중 2가지 이상 조합이어야 합니다.');
      return;
    }

    try {
      const res = await axios.post('/api/email/resetPassword', {
        userId,
        newPassword,
      });

      setShowModal(true);
    } catch (err) {
      alert('비밀번호 재설정에 실패하였습니다.')
      console.log(err)
      setError(err.response?.data || '비밀번호 재설정 실패');
    }
  };

  return (
    <div className={styles.formContainer}>

      <div className={styles.tableForm}>

        <div className={styles.tableRow}>
          <div className={`${styles.tableCell} ${styles.labelCell}`}>아이디</div>
          <div className={`${styles.tableCell} ${styles.inputCell}`}>
            <input
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="아이디 입력"
              autoComplete="off" />
          </div>
        </div>

        <div className={styles.tableRow}>
          <div className={`${styles.tableCell} ${styles.labelCell}`}>이메일</div>
          <div className={`${styles.tableCell} ${styles.inputCell}`}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="이메일 입력" autoComplete="off" />
            <button
              className={styles.verifyButton}
              onClick={sendCode}>
              인증번호 발송
            </button>
          </div>
        </div>

        <div className={styles.tableRow}>
          <div className={`${styles.tableCell} ${styles.labelCell}`}>인증번호</div>
          <div className={`${styles.tableCell} ${styles.inputCell}`}>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="인증번호 입력"
              disabled={isCodeVerified} />
            <button
              className={`${styles.verifyButton} ${isCodeVerified ? styles.disabledButton : ''}`}
              onClick={verifyCode}
              disabled={isCodeVerified}>
              인증번호 확인
            </button>
            {sentCode && timer > 0 && <span className={styles.timer}>{formatTime(timer)}</span>}
          </div>
        </div>

        <div className={styles.tableRow}>
          <div className={`${styles.tableCell} ${styles.labelCell}`}>새 비밀번호</div>
          <div className={`${styles.tableCell} ${styles.inputCell}`}>
            <input
              type="password"
              ref={passwordInputRef}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 입력"
              autoComplete="off" />
          </div>
        </div>

      </div>

      <button className={styles.button} onClick={resetPassword}>
        비밀번호 재설정
      </button>
      {message && <p className={styles.resultMessage}>{message}</p>}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>비밀번호 재설정이 완료되었습니다.<br />로그인 페이지로 이동하시겠습니까?</p>
            <div className={styles.modalButtons}>
              <button onClick={() => {
                navigate('/users/login');
                setUserId('');
                setEmail('');
                setCode('');
                setNewPassword('');
                setIsCodeVerified(false);
              }}>확인</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindAccount;
export { FindIdForm, FindPwdForm };

