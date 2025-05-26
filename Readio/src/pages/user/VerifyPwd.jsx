import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VerifyPwd.module.css';
import axios from 'axios';


function VerifyPwd() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            // 예시: 비밀번호 검증 API 호출 (백엔드에 맞게 URL과 요청 데이터 조정 필요)
            await axios.post('/users/verifypwd', { password });

            // 성공하면 로컬스토리지에 인증 플래그 저장
            localStorage.setItem('isPasswordVerified', 'true');

            // 회원정보 수정 페이지로 이동
            navigate('/users/edit');
        } catch (error) {
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