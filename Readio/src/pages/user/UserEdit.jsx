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
        const isPasswordVerified = sessionStorage.getItem('isPasswordVerified');   //5.30 변경 테스트중
        const accessToken = sessionStorage.getItem('accessToken');   //5.30 변경 테스트중
        // const isPasswordVerified = localStorage.getItem('isPasswordVerified');
        // const accessToken = localStorage.getItem('accessToken');

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
                console.log("전체 응답", response)
                console.log("회원정보 불러오기 성공", response.data);
                const data = response.data;
                setFormData(prev => ({
                    ...prev,
                    userId: data.userId || '',
                    userName: data.userName || '',
                    userEmail: data.userEmail || '',
                    userPhone: data.userPhone || '',
                    userBirthday: data.userBirthday || '',
                }));
            })
            .catch(error => {
                console.error('회원정보 불러오기 실패:', error.response ? error.response.data : error.message);
                alert('회원정보를 불러오는 데 실패했습니다. 다시 시도해주세요.');
                sessionStorage.removeItem('userId');   //5.30 변경 테스트중
                sessionStorage.removeItem('accessToken');   //5.30 변경 테스트중
                // localStorage.removeItem('userId');
                // localStorage.removeItem('accessToken');
                navigate('/users/login');
            });
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

        const accessToken = sessionStorage.getItem('accessToken');   //5.30 변경 테스트중
        // const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/users/login');
            return;
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
                            readOnly
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
                            placeholder="새로운 비밀번호 입력(변경 시에만 입력하세요)"
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