import axios from 'axios';
import React, { useState } from 'react';
import styles from './Join.module.css';

function Join() {

    // 회원가입 폼 상태
    const [form, setForm] = useState({
        userName: '',
        userId: '',
        userPwd: '',
        userPwdCheck: '',
        userEmail: '',
        userPhone: '',
        userBirthday: ''
    });

    // 오류 메시지 
    const [idMessage, setIdMessage] = React.useState("");
    const [nameMessage, setNameMessage] = React.useState("");
    const [pwdMessage, setPwdMessage] = React.useState("");
    const [pwdConfirmMessage, setPwdConfirmMessage] = React.useState("");
    const [emailMessage, setEmailMessage] = React.useState("");
    const [phoneMessage, setPhoneMessage] = React.useState("");
    const [birthdayMessage, setBirthdayMessage] = React.useState("");

    const [isId, setIsId] = React.useState(false);
    const [isName, setIsName] = React.useState(false);
    const [isPwd, setIsPwd] = React.useState(false);
    const [isPwdConfirm, setIsPwdConfirm] = React.useState(false);
    const [isEmail, setIsEmail] = React.useState(false);
    const [isPhone, setIsPhone] = React.useState(false);
    const [isBirthday, setIsBirthday] = React.useState(false);

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isEmailChecked, setIsEmailCheckd] = useState(false);
    const [isPhoneChecked, setIsphoneChecked] = useState(false);



    // 이름 유효성 검사
    const onChangeName = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, userName: value }));
        setIsIdChecked(false)

        const nameRegExp = /^[가-힣a-zA-Z]{2,30}$/;
        if (!nameRegExp.test(value)) {
            setNameMessage("한글은 6자 이내, 영문은 30자 이내로 입력해 주세요.");
            setIsName(false);
        } else {
            setNameMessage("사용 가능한 이름입니다.");
            setIsName(true);
        };
    }

    // 아이디 유효성 검사
    const onChangeId = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, userId: value }));
        setIsIdChecked(false);

        const idRegExp = /^[a-zA-Z0-9]{6,20}$/;
        if (!idRegExp.test(value)) {
            setIdMessage("6자리 이상의 영문 혹은, 영문,숫자를 조합하여 입력해 주세요.");
            setIsId(false);
        } else {
            setIdMessage("중복확인을 눌러주세요.");
            setIsId(true);
        };
    }

    // 비밀번호 유효성 검사
    const onChangePwd = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, userPwd: value }));

        const lengthValid = /^.{8,20}$/.test(value);
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        const typesCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

        if (!lengthValid || typesCount < 2) {
            setPwdMessage("영문/숫자/특수문자 중 2가지 이상 조합(8~20자)");
            setIsPwd(false);
        } else {
            setPwdMessage("");
            setIsPwd(true);
        };
    }

    // 비밀번호 확인란 유효성 검사 
    const onChangePwdConfirm = (e) => {
        const value = e.target.value;
        const currentPwd = form.userPwd;

        setForm((prev) => ({ ...prev, userPwdCheck: value }));

        if (currentPwd !== value) {
            setPwdConfirmMessage("비밀번호가 일치하지 않습니다.");
            setIsPwdConfirm(false)
        } else {
            setPwdConfirmMessage("비밀번호가 일치합니다.");
            setIsPwdConfirm(true);
        }
    }

    // 이메일 유효성 검사
    const onChangeEmail = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, userEmail: value }));

        const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // @ 기준 앞 구간은 알파벳 또는 숫자 조합
        // @ 기준 뒤 구간은 알파벳 또는 숫자 조합
        // @은 반드시 1개만 존재
        // @ 뒤에서 . 기준 뒤 구간도 알파벳 또는 숫자 조합   (\.이 .임)

        if (!emailRegExp.test(value)) {
            setEmailMessage("유효한 이메일 주소를 입력해 주세요.");
            setIsEmail(false);
        } else {
            setEmailMessage("중복확인을 눌러주세요.");
            setIsEmail(true);
        };
    }

    // 휴대폰번호 유효성 검사 
    const onChangePhone = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, userPhone: value }));

        const phoneRegExp = /^(01[016789]|02|0[3-9][0-9])-[0-9]{3,4}-[0-9]{4}$/;

        if (!phoneRegExp.test(value)) {
            setPhoneMessage("'-'를 포함하여 입력해 주세요.'");
            setIsPhone(false);
        } else {
            setPhoneMessage("중복확인을 눌러주세요.");
            setIsPhone(true);
        }
    }

    // 생년월일 유효성 검사
    const onChangeBirthday = (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, userBirthday: value }));

        if (!value) {
            setBirthdayMessage("생년월일을 입력해 주세요.");
            setIsBirthday(false);
            return;
        }

        // 미래날짜 X
        const selectDate = new Date(value);
        const today = new Date();

        if (selectDate > today) {
            setBirthdayMessage("생년월일을 다시 확인해 주세요.");
            setIsBirthday(false);
        } else {
            setBirthdayMessage("");
            setIsBirthday(true);
        }
    }

    // 약관 동의 상태
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    // const [agreeMarketing, setAgreeMarketing] = useState(false);
    // const [agreeThirdParty, setAgreeThirdParty] = useState(false);

    // 모달 상태
    const [isTermsModalOpen, setTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);

    // 모달 핸들러
    const openTermsModal = () => setTermsModalOpen(true);
    const closeTermsModal = () => setTermsModalOpen(false);

    const openPrivacyModal = () => setPrivacyModalOpen(true);
    const closePrivacyModal = () => setPrivacyModalOpen(false);

    // 아이디 중복확인 핸들러
    const onClickCheckId = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/users/join/check-id`, {
                params: { userId: form.userId },
            });
            console.log("아이디 중복확인 결과:", response.data);

            if (response.data.exist) {  // 존재하면
                setIdMessage("이미 사용중인 아이디입니다.")
                setIsId(false);
                setIsIdChecked(false);
            } else {
                setIdMessage("사용 가능한 아이디입니다.")
                setIsId(true);
                setIsIdChecked(true);

            }
        } catch (error) {   // 배포할땐 error변수를 _ 로 바꿀 것
            console.log("아이디 중복확인 오류 발생:", error)

            setIdMessage("중복확인 중 오류가 발생했습니다.")
            setIsId(false);
            setIsIdChecked(false);
        }
    }

    // 이메일 중복확인
    const onClickCheckEmail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/users/join/check-email`, {
                params: { userEmail: form.userEmail },
            });

            if (response.data.exist) {
                setEmailMessage("이미 사용중인 이메일입니다.")
                setIsEmail(false);
                setIsEmailCheckd(false);

            } else {
                setEmailMessage("사용 가능한 이메일입니다.")
                setIsEmail(true);
                setIsEmailCheckd(true);

            }
        } catch (error) {   // 배포할땐 error변수를 _ 로 바꿀 것
            console.log("이메일 중복확인 오류 발생:", error)

            setEmailMessage("중복확인 중 오류가 발생했습니다.")
            setIsEmail(false);
            setIsEmailCheckd(false);
        }
    }

    // 전화번호 중복확인
    const onClickCheckPhone = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/users/join/check-phone`, {
                params: { userPhone: form.userPhone },
            });

            if (response.data.exist) {
                setPhoneMessage("이미 사용중인 전화번호입니다.")
                setIsPhone(false);
                setIsphoneChecked(false);
            } else {
                setPhoneMessage("사용 가능한 전화번호입니다.")
                setIsPhone(true);
                setIsphoneChecked(true)
            }
        } catch (error) {   // 배포할땐 error변수를 _ 로 바꿀 것
            console.log("전화번호 중복확인 중 오류 발생:", error)

            setPhoneMessage("중복확인 중 오류가 발생했습니다.")
            setIsPhone(false);
            setIsphoneChecked(false);
        }
    }

    // 회원가입 버튼 클릭 핸들러
    const handleJoin = async () => {

        if (!form.userName || !form.userId || !form.userPwd || !form.userPwdCheck || !form.userEmail || !form.userPhone || !form.userBirthday) {
            alert("모든 필수 항목을 입력해 주세요.")
            return;
        }

        if (!(isName && isId && isPwd && isPwdConfirm && isEmail && isPhone && isBirthday)) {
            alert("입력한 정보를 다시 확인해 주세요.");
            return;
        }

        if (!agreeTerms || !agreePrivacy) {
            alert('필수 약관에 동의해 주세요.');
            return;
        }

        if (!(isName && isPwd && isPwdConfirm && isBirthday &&
            isIdChecked && isEmailChecked && isPhoneChecked)) {
            alert("중복 확인을 다시 확인해 주세요.")
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/users/join', {
                userName: form.userName,
                userId: form.userId,
                userPwd: form.userPwd,
                userEmail: form.userEmail,
                userPhone: form.userPhone,
                userBirthday: form.userBirthday
            });

            alert('회원가입성공');
            console.log(response.data);
            window.location.href = '/';
        } catch (error) {
            alert(error.response?.data || '회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
    };



    return (
        <div className={styles.joinPage}>
            {/* 회원정보 입력 */}
            <section className={styles.formSection}>
                <hr className={styles.line1} />
                <h2 className={styles.sectionTitle}>&nbsp;&nbsp;
                    회원정보 입력
                    <span className={styles.required}>(필수)</span>
                </h2>
                <hr className={styles.line2} />

                <div className={styles.formGroup}>
                    <label>이름</label>
                    <input
                        name="userName"
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={form.userName}
                        onChange={onChangeName} />
                </div>
                <p className={`${styles.message} ${isName ? styles.success : styles.error}`}>{nameMessage}</p>


                <div className={styles.formGroup}>
                    <label>아이디</label>
                    <input
                        name="userId"
                        type="text"
                        placeholder="아이디를 입력하세요"
                        value={form.userId}
                        onChange={onChangeId} />
                    <button type="button" className={styles.checkBtn} onClick={onClickCheckId}>중복확인</button>
                </div>
                <p className={`${styles.message} ${isId ? styles.success : styles.error}`}>{idMessage}</p>


                <div className={styles.formGroup}>
                    <label>비밀번호</label>
                    <input
                        name="userPwd"
                        type="password"
                        placeholder="비밀번호 입력"
                        value={form.userPwd}
                        onChange={onChangePwd} />
                </div>
                <p className={`${styles.message} ${isPwd ? styles.success : styles.error}`}>{pwdMessage}</p>

                <div className={styles.formGroup}>
                    <label>비밀번호 확인</label>
                    <input
                        name="userPwdCheck"
                        type="password"
                        placeholder="비밀번호 확인"
                        value={form.userPwdCheck}
                        onChange={onChangePwdConfirm} />
                </div>
                <p className={`${styles.message} ${isPwdConfirm ? styles.success : styles.error}`}>{pwdConfirmMessage}</p>

                <div className={styles.formGroup}>
                    <label>이메일</label>
                    <input
                        name="userEmail"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={form.userEmail}
                        onChange={onChangeEmail} />
                    <button type="button" className={styles.checkBtn} onClick={onClickCheckEmail}>중복확인</button>
                </div>
                <p className={`${styles.message} ${isEmail ? styles.success : styles.error}`}>{emailMessage}</p>

                <div className={styles.formGroup}>
                    <label>휴대폰 번호</label>
                    <input
                        name="userPhone"
                        type="tel"
                        placeholder="휴대폰 번호 입력"
                        value={form.userPhone}
                        onChange={onChangePhone} />
                    <button type="button" className={styles.checkBtn} onClick={onClickCheckPhone}>중복확인</button>
                </div>
                <p className={`${styles.message} ${isPhone ? styles.success : styles.error}`} >{phoneMessage}</p>

                <div className={styles.formGroup}>
                    <label>생년월일</label>
                    <input
                        name="userBirthday"
                        type="date"
                        value={form.userBirthday}
                        onChange={onChangeBirthday} />
                </div>
                <p className={`${styles.message} ${isBirthday ? styles.success : styles.error}`}>{birthdayMessage}</p>
            </section>

            <hr className={styles.line1} />
            {/* 약관동의 */}
            <section className={styles.termsSection}>
                <h2 className={styles.sectionTitle}>약관동의</h2>


                <div className={styles.checkboxRow}>
                    <label>
                        <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} /> [필수] 사이트 이용약관 동의</label>
                    <button type="button" onClick={openTermsModal} className={styles.modalBtn}>
                        자세히보기
                    </button>
                </div>

                {isTermsModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3>[필수] 사이트 이용약관 동의</h3>
                            <div className={styles.modalBody}>
                                <p>이 약관은 주식회사 리디오(이하 “회사”)가 제공하는 맞춤형 플랫폼 서비스(이하 “서비스”)에 대한 이용계약을 체결한 이용자(이하 “회원”)의 서비스 이용조건 및 절차,
                                    회사와 회원의 권리와 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                                <p>보관 기간은 서비스 탈퇴 시까지입니다.</p>
                                <p>블라블라~~</p>
                            </div>
                            <button onClick={closeTermsModal} className={styles.closeBtn}>닫기</button>
                        </div>
                    </div>
                )}


                <div className={styles.checkboxGroup}>
                    <label><input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} /> [필수] 개인정보 수집 및 이용 동의</label>
                    <button type="button" onClick={openPrivacyModal} className={styles.modalBtn}>
                        자세히 보기
                    </button>
                </div>

                {isPrivacyModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3>개인정보 수집 및 이용 동의</h3>
                            <div className={styles.modalBody}>
                                <p>본인은 개인정보 수집 및 이용에 동의합니다. 수집 항목은 이름, 이메일, 휴대폰번호 등이며, 목적은 회원관리입니다.</p>
                                <p>보관 기간은 서비스 탈퇴 시까지입니다.</p>
                            </div>
                            <button onClick={closePrivacyModal} className={styles.closeBtn}>닫기</button>
                        </div>
                    </div>
                )}

                <div className={styles.checkboxGroup}>
                    <label><input type="checkbox" /> [선택] 마케팅 정보 수신 동의</label>
                </div>

                <div className={styles.checkboxGroup}>
                    <label><input type="checkbox" /> [선택] 제3자 정보 제공 동의</label>
                </div>
            </section>

            <hr className={styles.line1} />
            <div className={styles.submitBtnWrap}>
                <button type="submit" onClick={handleJoin} className={styles.submitBtn}>동의하고 가입하기</button>
            </div>
        </div>
    );
}
export default Join;