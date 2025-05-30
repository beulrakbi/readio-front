import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Redux 상태를 사용하기 위해 추가
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../apis/axiosInstance'; // axios 대신 axiosInstance 사용
import styles from './VerifyPwd.module.css';

function VerifyPwd() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const isLogin = useSelector((state) => state.user.isLogin);
    const userIdFromRedux = useSelector((state) => state.user.userInfo?.userId);

    // 디버깅을 위해 Redux 상태만 로그에 남기기
    console.log("VerifyPwd: Redux isLogin:", isLogin);
    console.log("VerifyPwd: Redux userIdFromRedux:", userIdFromRedux);


    // 해당 페이지에서 새로고침 시 redux가 초기화되면서 로그인 안내 에러
    // 아래 코드 추가
    const isReduxReady = useSelector(state => state.user.accessToken !== null);

    useEffect(() => {
        if (isReduxReady && (!isLogin || !userIdFromRedux)) {
            alert('로그인이 필요합니다.');
            navigate('/users/login');
        }
    }, [isReduxReady, isLogin, userIdFromRedux, navigate]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!password) {
            alert("비밀번호를 입력하세요");
            return;
        }
        console.log("비밀번호 확인 요청 전");

        try {
            // userId는 Redux에서 가져온 값을 사용합니다.
            // axiosInstance를 사용하면 Authorization 헤더는 자동으로 추가됩니다.
            const response = await axiosInstance.post('/users/verifypwd', {
                userId: userIdFromRedux,
                password
            });

            console.log("비밀번호 확인 요청 후", response.data);

            sessionStorage.setItem('isPasswordVerified', 'true');

            // 비밀번호 확인이 성공했으므로, 이제 UserEdit 페이지로 이동
            // 이 시점에서는 isLogin과 userIdFromRedux가 유효하므로, 
            // UserEdit 페이지의 PrivateRoute (만약 있다면) 검사를 통과할 것입니다.
            navigate('/users/edit');
        } catch (error) {
            console.error("비밀번호 확인 실패:", error);
            console.log("상태 코드:", error.response?.status, "서버 메시지:", error.response?.data);

            if (!error.response) {
                alert('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
            }
            else if (error.response?.status === 401) {
                alert(error.response.data?.message || '비밀번호가 일치하지 않습니다.');
            } else {
                alert('비밀번호 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
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