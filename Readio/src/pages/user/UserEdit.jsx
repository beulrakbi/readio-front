import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './UserEdit.module.css';

function UserEdit() {

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

    useEffect(() => {
        const isPasswordVerified = localStorage.getItem('isPasswordVerified');
        if (isPasswordVerified !== 'true') {
            // 비밀번호가 검증되지 않은 경우, 비밀번호 확인 페이지로 리다이렉트
            navigate('/users/verifypwd');
        } else {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('로그인이 필요합니다.');
                navigate('/users/login');
                return;
            }

            setFormData(prev => ({ ...prev, userId }));

            // axios.get(`http://localhost:8080/users/edit?userId=${userId}`, {
            axios.get(`http://localhost:8080/users/edit?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}` // 토큰 인증 헤더 추가
                }
            })
                .then(response => {
                    console.log("전체 응답", response)
                    console.log("회원정보 불러오기 성공", response.data);
                    const data = response.data;
                    setFormData(prev => ({
                        ...prev,
                        userName: data.userName || '',
                        userEmail: data.userEmail || '',
                        userPhone: data.userPhone || '',
                        userBirthday: data.userBirthday || ''
                    }));
                })
                .catch(() => {
                    alert('회원정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('accessToken');
                    navigate('/');
                });

        }
    }, [navigate])

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (formData.userPwd || formData.userPwdConfirm) {
            if (formData.userPwd !== formData.userPwdConfirm) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
        }

        try {
            const submitData = {
                userId: formData.userId,
                userName: formData.userName,
                userPwd: formData.userPwd,
                userEmail: formData.userEmail,
                userPhone: formData.userPhone,
                userBirthday: formData.userBirthday,
            };

            if (formData.userPwd) {
                submitData.userPwd = formData.userPwd;
            }


            const response = await axios.put('/users/edit', submitData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.status === 200) {
                alert('회원정보가 성공적으로 수정되었습니다.');
                navigate('/users/profile'); // 수정 후 프로필 페이지로 이동
            } else {
                alert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('회원정보 수정 중 오류 발생:', error);
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
                            placeholder="이름을 입력하세요"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>아이디</label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            readOnly
                        />
                        {/* <button type="button" className={styles.checkBtn}>중복확인</button> */}
                    </div>

                    <div className={styles.formGroup}>
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="userPwd"
                            value={formData.userPwd}
                            onChange={onChangeHandler}
                            placeholder="비밀번호 입력"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            name="userPwdConfirm"
                            value={formData.userPwdConfirm}
                            onChange={onChangeHandler}
                            placeholder="비밀번호 확인"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>이메일</label>
                        <input
                            type="email"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={onChangeHandler}
                            placeholder="이메일 입력"
                            required
                        />
                        <button type="button" className={styles.checkBtn}>중복확인</button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>휴대폰 번호</label>
                        <input
                            type="tel"
                            name="userPhone"
                            value={formData.userPhone}
                            onChange={onChangeHandler}
                            placeholder="휴대폰 번호 입력"
                            required
                        />
                        <button type="button" className={styles.checkBtn}>중복확인</button>
                    </div>

                    <div className={styles.formGroup}>
                        <label>생년월일</label>
                        <input
                            type="date"
                            name="userBirthday"
                            value={formData.userBirthday}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>

                </section>

                {/* 약관동의 */}
                <hr className={styles.line1} />
                <section className={styles.termsSection}>
                    <p className={styles.description}>
                        • 회원탈퇴 후 동일 아이디로 재가입이 불가합니다.
                        <NavLink to={"/users/verify-pwd"} className={styles.deleteAccount}>회원탈퇴 &gt;
                        </NavLink>
                    </p>
                </section>

                <div className={styles.submitBtnWrap}>
                    <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>취소</button>
                    <button type="submit" className={styles.submitBtn}>수정</button>
                </div>
            </form>
        </div>
    );
}
export default UserEdit;