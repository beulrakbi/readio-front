import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './UserEdit.module.css';

function UserEdit() {

    const [emailMessage, setEmailMessage] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(null); // true / false / null
    // 정보가 변경됐다면 중복확인을 눌러야만 수정 가능
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [emailChanged, setEmailChanged] = useState(false);

    const [phoneMessage, setPhoneMessage] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(null); // true / false / null
    const [isPhoneChecked, setIsPhoneChecked] = useState(false);
    const [phoneChanged, setPhoneChanged] = useState(false);

    const [pwdMessage, setPwdMessage] = useState('');
    const [pwdConfirmMessage, setPwdConfirmMessage] = useState('');
    const [isPwd, setIsPwd] = useState(false);
    const [isPwdConfirm, setIsPwdConfirm] = useState(false);


    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        userName: '',
        userPwd: '',
        userPwdConfirm: '',
        userEmail: '',
        userPhone: '',
        userBirthday: '',
    });
    const [initialFormData, setInitialFormData] = useState(null);

    // 이메일 중복확인
    const handleEmailCheck = async () => {
        const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const accessToken = sessionStorage.getItem('accessToken');

        if (!emailRegExp.test(formData.userEmail)) {
            setEmailMessage('유효한 이메일 주소를 입력해 주세요.');
            setIsEmailValid(false);
            return;
        }

        if (!emailChanged) {
            alert('변경된 정보가 없습니다.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/users/edit/check-email`, {
                params: { userEmail: formData.userEmail },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            if (response.data.exist) {
                setEmailMessage('이미 사용 중인 이메일입니다.');
                setIsEmailValid(false);
                setIsEmailChecked(false);
            } else {
                setEmailMessage('사용 가능한 이메일입니다.');
                setIsEmailValid(true);
                setIsEmailChecked(true);
            }
        } catch (error) {
            console.error('이메일 중복확인 오류:', error);
            setEmailMessage('이메일 중복확인 중 오류가 발생했습니다.');
            setIsEmailValid(false);
            setIsEmailChecked(false);
        }
    };


    // 전화번호 중복확인
    const handlePhoneCheck = async () => {
        const phoneRegExp = /^01[016789]-?\d{3,4}-?\d{4}$/;
        const accessToken = sessionStorage.getItem('accessToken');

        if (!phoneRegExp.test(formData.userPhone)) {
            setPhoneMessage('유효한 휴대폰 번호를 입력해 주세요.');
            setIsPhoneValid(false);
            return;
        }

        if (!phoneChanged) {
            alert('변경된 정보가 없습니다.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/users/edit/check-phone`, {
                params: { userPhone: formData.userPhone },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            if (response.data.exist) {
                setPhoneMessage('이미 사용 중인 전화번호입니다.');
                setIsPhoneValid(false);
                setIsPhoneChecked(false);
            } else {
                setPhoneMessage('사용 가능한 전화번호입니다.');
                setIsPhoneValid(true);
                setIsPhoneChecked(true);
            }
        } catch (error) {
            console.error('휴대폰 번호 중복확인 오류:', error);
            setPhoneMessage('휴대폰 번호 중복확인 중 오류가 발생했습니다.');
            setIsPhoneValid(false);
            setIsPhoneChecked(false);
        }
    };

    const onChangePwd = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, userPwd: value }));

        const lengthValid = /^.{8,20}$/.test(value);
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const typesCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

        if (!lengthValid || typesCount < 2) {
            setPwdMessage("영문/숫자/특수문자 중 2가지 이상 조합(8~20자)");
            setIsPwd(false);
        } else {
            setPwdMessage("사용 가능한 비밀번호입니다.");
            setIsPwd(true);
        }
    };

    const onChangePwdConfirm = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, userPwdConfirm: value }));

        if (formData.userPwd !== value) {
            setPwdConfirmMessage("비밀번호가 일치하지 않습니다.");
            setIsPwdConfirm(false);
        } else {
            setPwdConfirmMessage("비밀번호가 일치합니다.");
            setIsPwdConfirm(true);
        }
    };

    useEffect(() => {
        const isPasswordVerified = sessionStorage.getItem('isPasswordVerified');   //5.30 변경 테스트중
        const accessToken = sessionStorage.getItem('accessToken');   //5.30 변경 테스트중

        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/users/login');
            return;
        }

        if (isPasswordVerified !== 'true') {
            // 비밀번호가 검증되지 않은 경우, 비밀번호 확인 페이지로 리다이렉트
            navigate('/users/verifypwd');
            return;
        }

        axios.get(`http://localhost:8080/users/edit`, {
            headers: {
                Authorization: `Bearer ${accessToken}` // 토큰 인증 헤더 추가
            },
        })
            .then(response => {
                const data = response.data;
                const userInfo = {
                    userId: data.userId || '',
                    userName: data.userName || '',
                    userEmail: data.userEmail || '',
                    userPhone: data.userPhone || '',
                    userBirthday: data.userBirthday || '',
                    userPwd: '',
                    userPwdConfirm: '',
                };
                setFormData(userInfo);
                setInitialFormData(userInfo);
            })
            .catch(error => {
                console.error('회원정보 불러오기 실패:', error);
                alert('회원정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
                sessionStorage.removeItem('userId');
                sessionStorage.removeItem('accessToken');
                navigate('/users/login');
            });
    }, [navigate]);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newFormData = {
                ...prev,
                [name]: value,
            };

            // 이메일이나 전화번호가 바뀐 경우 중복확인 상태 초기화
            if (name === 'userEmail') {
                setEmailChanged(value !== initialFormData.userEmail);
                setIsEmailChecked(false);
                setIsEmailValid(null);
            }

            if (name === 'userPhone') {
                setPhoneChanged(value !== initialFormData.userPhone);
                setIsPhoneChecked(false);
                setIsPhoneValid(null);
            }

            return newFormData;
        });
    };

    const isSameInfo = (a, b) => (
        a.userEmail === b.userEmail &&
        a.userPhone === b.userPhone &&
        a.userBirthday === b.userBirthday &&
        !a.userPwd
    );

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const accessToken = sessionStorage.getItem('accessToken');   //5.30 변경 테스트중
        // const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/users/login');
            return;
        }

        if (initialFormData && isSameInfo(formData, initialFormData)) {
            alert("변경된 회원정보가 없습니다.");
            return;
        }

        if (emailChanged && !isEmailChecked) {
            alert("이메일 중복확인을 해주세요.");
            return;
        }

        if (phoneChanged && !isPhoneChecked) {
            alert("휴대폰 번호 중복확인을 해주세요.");
            return;
        }

        // 비밀번호가 입력된 경우 유효성 검사
        if (formData.userPwd || formData.userPwdConfirm) {
            if (!isPwd) {
                alert("비밀번호 형식이 올바르지 않습니다.");
                return;
            }
            if (!isPwdConfirm) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        try {
            const submitData = {
                userId: formData.userId,
                userName: formData.userName,
                userEmail: formData.userEmail,
                userPhone: formData.userPhone,
                userBirthday: formData.userBirthday,
            };

            // 비밀번호 필드가 입력된 경우에만 추가
            if (formData.userPwd) {
                submitData.userPwd = formData.userPwd;
            }

            const response = await axios.put('http://localhost:8080/users/edit', submitData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            if (response.status === 200) { // 백엔드가 200 OK를 보낼 때
                alert('회원정보가 성공적으로 수정되었습니다.');
                navigate('/users/edit');
            } else {
                // 백엔드에서 200 OK가 아닌 다른 성공 코드를 보낼 경우 (ex. 204 No Content)
                alert('회원정보 수정에 실패했습니다. (예상치 못한 응답)');
            }
        } catch (error) {
            console.error('회원정보 수정 중 오류 발생:', error);
            // 백엔드에서 ResponseEntity.badRequest() 또는 .status(HttpStatus.INTERNAL_SERVER_ERROR) 등을 보낼 때
            if (error.response) {
                // 서버가 응답했지만 상태 코드가 2xx 범위 밖인 경우
                console.error('서버 응답 데이터:', error.response.data);
                console.error('서버 응답 상태:', error.response.status);
                if (error.response.status === 400 || error.response.status === 404) {
                    alert(`회원정보 수정 실패: ${error.response.data || '유효하지 않은 요청입니다.'}`);
                } else if (error.response.status === 500) {
                    alert('회원정보 수정 실패: 서버 내부 오류가 발생했습니다.');
                } else {
                    alert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
                }
            } else if (error.request) {
                // 요청이 전송되었지만 응답을 받지 못한 경우 (네트워크 문제 등)
                alert('회원정보 수정 실패: 서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
            } else {
                // 요청을 설정하는 중에 오류가 발생한 경우
                alert('회원정보 수정 중 알 수 없는 오류 발생.');
            }
        }
    };

    return (
        <div className={styles.UserEditPage}>
            {/* 입력된 회원정보 */}
            <form onSubmit={onSubmitHandler}>
                <section className={styles.formSection}>
                    <hr className={styles.line1} />
                    <h2 className={styles.sectionTitle}>&nbsp;&nbsp;
                        회원정보 수정
                    </h2>
                    <hr className={styles.line2} />

                    <div className={styles.formGroup}>
                        <label>이름</label>
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={onChangeHandler}
                            readOnly />
                    </div>
                    <p className={styles.message}>
                    </p>

                    <div className={styles.formGroup}>
                        <label>아이디</label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            readOnly />
                    </div>
                    <p className={styles.message}>
                    </p>

                    <div className={styles.formGroup}>
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="userPwd"
                            value={formData.userPwd}
                            onChange={onChangePwd}
                            placeholder="새로운 비밀번호 입력(변경 시에만 입력하세요)" />
                    </div>
                    <p className={`${styles.message} ${isPwd ? styles.success : styles.error}`}>
                        {pwdMessage}
                    </p>

                    <div className={styles.formGroup}>
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            name="userPwdConfirm"
                            value={formData.userPwdConfirm}
                            onChange={onChangePwdConfirm}
                            placeholder="비밀번호 확인" />
                    </div>
                    <p className={`${styles.message} ${isPwdConfirm ? styles.success : styles.error}`}>
                        {pwdConfirmMessage}
                    </p>

                    <div className={styles.formGroup}>
                        <label>이메일</label>
                        <input
                            type="email"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={onChangeHandler}
                            placeholder="이메일 입력"
                            required />
                        <button
                            type="button"
                            className={styles.checkBtn}
                            onClick={handleEmailCheck} >
                            중복확인
                        </button>
                    </div>
                    <p className={`${styles.message} ${isEmailValid === true ? styles.success : isEmailValid === false ? styles.error : ''}`}>
                        {emailMessage}
                    </p>

                    <div className={styles.formGroup}>
                        <label>휴대폰 번호</label>
                        <input
                            type="tel"
                            name="userPhone"
                            value={formData.userPhone}
                            onChange={onChangeHandler}
                            placeholder="휴대폰 번호 입력"
                            required />
                        <button type="button"
                            className={styles.checkBtn}
                            onClick={handlePhoneCheck} >
                            중복확인
                        </button>
                    </div>
                    <p className={`${styles.message} ${isPhoneValid === true ? styles.success : isPhoneValid === false ? styles.error : ''}`}>
                        {phoneMessage}
                    </p>

                    <div className={styles.formGroup}>
                        <label>생년월일</label>
                        <input
                            type="date"
                            name="userBirthday"
                            value={formData.userBirthday}
                            onChange={onChangeHandler}
                            required />
                    </div>

                </section>

                {/* 약관동의 */}
                <hr className={styles.line1} />
                <section className={styles.termsSection}>
                    <p className={styles.description}>
                        • 회원탈퇴 후 동일 아이디로 재가입이 불가합니다.
                        <Link to={"/users/delete"} className={styles.deleteAccount}>회원탈퇴 &gt;
                        </Link>
                    </p>
                </section>

                <div className={styles.submitBtnWrap}>
                    <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>취소</button>
                    <button type="submit" className={styles.submitBtn}>수정</button>
                </div>
            </form>
        </div >
    );
}
export default UserEdit;