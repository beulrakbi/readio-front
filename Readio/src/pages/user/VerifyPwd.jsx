import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VerifyPwd.module.css';


function VerifyPwd() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    console.log("localStorage userId: ", localStorage.getItem('userId'));
    console.log("typeof userId: ", typeof userId);

    useEffect(() => {
        if (!userId || userId == 'null' || userId == 'undefined') {
            alert('로그인이 필요합니다.');
            navigate('/users/login');
        }
    }, [userId, navigate]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!password) {
            alert("비밀번호를 입력하세요");
            return;
        }
        console.log("비밀번호 확인 요청 전")
        try {
            // 예시: 비밀번호 검증 API 호출 (백엔드에 맞게 URL과 요청 데이터 조정 필요)
            const response = await axios.post('http://localhost:8080/users/verifypwd', { userId, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 토큰 인증 헤더 추가
                }

            });
            console.log("비밀번호 확인 요청 후", response.data);
            // 성공하면 로컬스토리지에 인증 플래그 저장
            localStorage.setItem('isPasswordVerified', 'true');

            // 회원정보 수정 페이지로 이동
            navigate('/users/edit');
        } catch (error) {
            console.error("비밀번호 확인 실패:", error);
            alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        }
    };

    return (
        <div className={styles.VerifyPwdPage}>
            <section className={styles.formSection}>
                <div className={styles.contentBox}>
                    <hr className={styles.line1} />
                    <p className={styles.title}>비밀번호 확인</p>
                    <hr className={styles.line2} />
                    <p className={styles.description}>
                        소중한 정보보호를 위해, 비밀번호를 다시 입력해주세요.
                    </p>

                    {/* form 태그 추가하고 onSubmit 연결 */}
                    <form onSubmit={onSubmitHandler}>
                        <div className={styles.formGroup}>
                            <label>현재 비밀번호</label>
                            <input
                                type="password"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.submitBtnWrap}>
                            <button type="submit" className={styles.submitBtn}>확인</button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
export default VerifyPwd;