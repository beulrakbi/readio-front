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
    const [isEmailChecked, setIsEmailChecked] = useState(false);
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
    const [agreeMarketing, setAgreeMarketing] = useState(false);
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

        // 중복확인 시에도 유효성검사 체크 필요
        const idRegExp = /^[a-zA-Z0-9]{6,20}$/;

        if (!idRegExp.test(form.userId)) {
            setIdMessage("아이디 형식이 올바르지 않습니다. 6~20자의 영문 또는 숫자만 사용 가능합니다.");
            setIsId(false);
            setIsIdChecked(false);
            return;
        }

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

    // 이메일 중복확인 핸들러
    const onClickCheckEmail = async () => {

        // 중복확인 시에도 유효성검사 체크 필요
        const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegExp.test(form.userEmail)) {
            setEmailMessage("유효한 이메일 주소를 입력해 주세요.");
            setIsEmail(false);
            setIsEmailChecked(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/users/join/check-email`, {
                params: { userEmail: form.userEmail },
            });

            if (response.data.exist) {
                setEmailMessage("이미 사용중인 이메일입니다.")
                setIsEmail(false);
                setIsEmailChecked(false);

            } else {
                setEmailMessage("사용 가능한 이메일입니다.")
                setIsEmail(true);
                setIsEmailChecked(true);

            }
        } catch (error) {   // 배포할땐 error변수를 _ 로 바꿀 것
            console.log("이메일 중복확인 오류 발생:", error)

            setEmailMessage("중복확인 중 오류가 발생했습니다.")
            setIsEmail(false);
            setIsEmailChecked(false);
        }
    }

    // 전화번호 중복확인 핸들러
    const onClickCheckPhone = async () => {

        const phoneRegExp = /^(01[016789]|02|0[3-9][0-9])-[0-9]{3,4}-[0-9]{4}$/;

        if (!phoneRegExp.test(form.userPhone)) {
            setPhoneMessage("'-'를 포함한 올바른 전화번호를 입력해 주세요.");
            setIsPhone(false);
            setIsphoneChecked(false);
            return;
        }

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
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)} />
                        [필수] 사이트 이용약관 동의
                    </label>
                    <button type="button"
                        onClick={openTermsModal}
                        className={styles.modalBtn}>
                        자세히보기
                    </button>
                </div>

                {isTermsModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>

                            <h3 className={styles.termsTitle}>[필수] 리디오 이용약관 동의</h3>
                            <div className={styles.modalBody}>
                                <h4 className={styles.termsSubTitle}>제1조 (목적)</h4>
                                <p className={styles.terms1}>
                                    이 약관은 주식회사 리디오(이하 “회사”)가 제공하는 맞춤형 플랫폼 서비스(이하 “서비스”)에 대한 이용계약을 체결한 이용자(이하 “회원”)의 서비스 이용조건 및 절차,
                                    회사와 회원의 권리와 의무 및 책임사항을 규정함을 목적으로 합니다.
                                </p>

                                <h4 className={styles.termsSubTitle}>제2조 (용어의 정의)</h4>
                                <p className={styles.terms1}>
                                    1. “회원”이란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다. <br />
                                    2. “아이디(ID)”란 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인한 문자 또는 숫자의 조합을 말합니다. <br />
                                    3. “비밀번호”란 회원이 부여받은 아이디와 일치된 회원임을 확인하고, 회원의 권익 보호를 위해 회원이 설정한 문자와 숫자의 조합을 말합니다. <br />
                                </p>

                                <h4 className={styles.termsSubTitle}>제4조 (회원가입)</h4>
                                <p className={styles.terms1}>
                                    1. 회원가입은 본 약관에 동의한 자가 회사가 정한 절차에 따라 가입 신청을 하고, 회사가 이를 승낙함으로써 체결됩니다. <br />
                                    2. 회사는 실명 사용, 정보 정확성 등을 기준으로 승낙 여부를 판단하며, 거절할 수 있습니다.
                                </p>

                                <h4 className={styles.termsSubTitle}>제5조 (회원의 의무)</h4>
                                <p className={styles.terms1}>
                                    회원은 본인의 아이디와 비밀번호를 안전하게 관리할 책임이 있으며, 이를 제3자에게 공유하거나 유출해서는 안 됩니다.
                                </p>

                                <h4 className={styles.termsSubTitle}>제6조 (서비스 이용)</h4>
                                <p className={styles.terms1}>
                                    회사는 서비스의 제공과 유지 관리를 위해 최선을 다하며, 안정적인 서비스 제공을 위해 정기 또는 비정기 점검을 수행할 수 있습니다.
                                </p>

                                <h4 className={styles.termsSubTitle}>제7조 (탈퇴 및 이용 제한)</h4>
                                <p className={styles.terms1}>
                                    회원은 언제든지 회원 탈퇴를 요청할 수 있으며, 회사는 관련 법령에 따라 처리합니다. 회사는 회원이 본 약관을 위반하거나 서비스 운영을 방해하는 경우,
                                    사전 통보 없이 이용을 제한하거나 회원 자격을 박탈할 수 있습니다.
                                </p>

                                <h4 className={styles.termsSubTitle}>제8조 (보관 및 파기)</h4>
                                <p className={styles.terms1}>
                                    회원의 정보는 서비스 탈퇴 시까지 보관되며, 이후 관련 법령에 따라 안전하게 파기됩니다.
                                </p>

                                <h4 className={styles.termsSubTitle}>제9조 (기타)</h4>
                                <p className={styles.terms1}>
                                    이 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는 대한민국 법령에 따릅니다.
                                </p>
                            </div>

                            <button onClick={closeTermsModal} className={styles.closeBtn}>닫기</button>
                        </div>
                    </div>
                )}


                <div className={styles.checkboxGroup}>
                    <label><input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)} />
                        [필수] 개인정보 수집 및 이용 동의
                    </label>

                    <button
                        type="button"
                        onClick={openPrivacyModal}
                        className={styles.modalBtn}>
                        자세히 보기
                    </button>
                </div>

                {isPrivacyModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>

                            <h3 className={styles.termsTitle}>[필수] 개인정보 처리방침 동의</h3>
                            <div className={styles.modalBody}>
                                <h4 className={styles.termsSubitle}>제1조 (수집하는 개인정보 항목)</h4>
                                <p className={styles.terms1}>
                                    회사는 회원가입, 서비스 이용 등을 위해 다음과 같은 개인정보를 수집합니다. <br />
                                    - 필수항목: 이름, 아이디, 비밀번호, 이메일, 휴대폰 번호 <br />
                                    - 서비스 이용 과정에서 자동 수집되는 정보: 접속 로그, 쿠키, IP 주소, 이용 기록 등
                                </p>

                                <h4 className={styles.termsSubitle}>제2조 (개인정보의 수집 및 이용 목적)</h4>
                                <p className={styles.terms1}>
                                    수집한 개인정보는 다음의 목적을 위해 사용됩니다. <br />
                                    - 회원 관리: 본인 확인, 회원 식별, 불량회원 제재 <br />
                                    - 서비스 제공: 콘텐츠 추천, 고객 지원, 공지사항 전달 <br />
                                    - 서비스 개선: 이용 통계 분석, 사용자 경험 향상
                                </p>

                                <h4 className={styles.termsSubitle}>제3조 (보유 및 이용 기간)</h4>
                                <p className={styles.terms1}>
                                    회원의 개인정보는 회원 탈퇴 시 또는 수집 목적 달성 시까지 보관되며, 이후 관련 법령에 따라 안전하게 파기됩니다.
                                </p>

                                <h4 className={styles.termsSubitle}>제4조 (개인정보의 제3자 제공)</h4>
                                <p className={styles.terms1}>
                                    회사는 법령에 근거하거나 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
                                </p>

                                <h4 className={styles.termsSubitle}>제5조 (이용자의 권리)</h4>
                                <p className={styles.terms1}>
                                    회원은 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 수집·이용에 대한 동의를 철회하거나 회원 탈퇴를 요청할 수 있습니다.
                                </p>
                            </div>

                            <button onClick={closePrivacyModal} className={styles.closeBtn}>닫기</button>
                        </div>

                    </div>
                )}

                <div className={styles.checkboxGroup}>
                    <label>
                        <input type="checkbox" />
                        [선택] 마케팅 정보 수신 동의
                    </label>

                    <button type="button"
                        onClick={openPrivacyModal}
                        className={styles.modalBtn}>
                        자세히 보기
                    </button>
                </div>

                {isPrivacyModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>

                            <h3>[선택] 마케팅 수신 동의</h3>
                            <div className={styles.modalBody}>
                                <h4 className={styles.termsSubTitle}>제1조 (수신 목적)</h4>
                                <p className={styles.terms1}>
                                    회사는 회원에게 다양한 혜택, 이벤트 및 서비스 안내 등의 정보를 이메일, 문자(SMS), 앱 푸시 등의 방식으로 제공할 수 있습니다.
                                </p>

                                <h4 className={styles.termsSubTitle}>제2조 (수신 항목)</h4>
                                <p className={styles.terms1}>
                                    - 이벤트 및 프로모션 관련 정보 <br />
                                    - 신상품 출시, 추천 콘텐츠, 할인 혜택 안내 <br />
                                    - 뉴스레터, 설문조사 및 사용자 참여 기회 제공
                                </p>

                                <h4 className={styles.termsSubTitle}>제3조 (동의 거부 권리)</h4>
                                <p className={styles.terms1}>
                                    마케팅 정보 수신에 대한 동의는 선택사항이며, 동의하지 않더라도 서비스 이용에는 제한이 없습니다. <br />
                                    동의 후에도 언제든지 수신을 거부할 수 있습니다.
                                </p>
                            </div>

                            <button onClick={closePrivacyModal} className={styles.closeBtn}>닫기</button>
                        </div>

                    </div>
                )}



                <div className={styles.checkboxGroup}>
                    <label><input
                        type="checkbox" />
                        [선택] 제3자 정보 제공 동의
                    </label>
                    <button type="button"
                        onClick={openPrivacyModal}
                        className={styles.modalBtn}>
                        자세히 보기
                    </button>
                </div>

                {isPrivacyModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>

                            <h3>[선택] 제3자 정보제공 동의</h3>
                            <div className={styles.modalBody}>
                                <h4 className={styles.termsTitle}>제1조 (제공받는 자)</h4>
                                <p className={styles.terms1}>
                                    - 예시:결제대행사, 카카오 알림톡 서비스 제공업체 등
                                </p>

                                <h4 className={styles.termsTitle}>제2조 (제공 항목)</h4>
                                <p className={styles.terms1}>
                                    - 이름, 연락처, 주소, 결제 정보 등 서비스 제공에 필요한 최소한의 정보
                                </p>

                                <h4 className={styles.termsTitle}>제3조 (제공 목적)</h4>
                                <p className={styles.terms1}>
                                    - 결제 처리, 고객 상담, 마케팅 정보 전달 등
                                </p>

                                <h4 className={styles.termsTitle}>제4조 (보유 및 이용 기간)</h4>
                                <p className={styles.terms1}>
                                    - 목적 달성 시 또는 관련 법령에 따라 보존 기간까지
                                </p>

                                <h4 className={styles.termsTitle}>제5조 (동의 거부 권리 안내)</h4>
                                <p className={styles.terms1}>
                                    - 귀하는 제3자 제공 동의를 거부할 수 있으며, 거부 시 일부 서비스 이용이 제한될 수 있습니다.
                                </p>
                            </div>

                            <button onClick={closePrivacyModal} className={styles.closeBtn}>닫기</button>
                        </div>

                    </div>
                )}

            </section>

            <hr className={styles.line1} />
            <div className={styles.submitBtnWrap}>
                <button type="submit" onClick={handleJoin} className={styles.submitBtn}>동의하고 가입하기</button>
            </div>
        </div>
    );
}
export default Join;