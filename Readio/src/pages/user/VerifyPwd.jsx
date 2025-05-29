import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VerifyPwd.module.css';
import { useSelector } from 'react-redux'; // Redux 상태를 사용하기 위해 추가
import axiosInstance from '../../apis/axiosInstance'; // axios 대신 axiosInstance 사용

function VerifyPwd() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Redux 스토어에서 로그인 상태와 사용자 정보를 가져옴
    const isLogin = useSelector((state) => state.user.isLogin);
    const userIdFromRedux = useSelector((state) => state.user.userInfo?.userId);

    // 디버깅을 위해 Redux 상태만 로그에 남기기
    console.log("VerifyPwd: Redux isLogin:", isLogin);
    console.log("VerifyPwd: Redux userIdFromRedux:", userIdFromRedux);

    // ✨ 중요: localStorage.getItem('userId') 관련 코드 완전히 제거
    // 이전 문제의 원인이 되었던 부분입니다.
    // const userId = localStorage.getItem('userId');
    // console.log("localStorage userId: ", localStorage.getItem('userId'));
    // console.log("typeof userId: ", typeof userId);
    // ✨ 이 위 3줄을 삭제해야 합니다. 

    useEffect(() => {
        if (!isLogin || !userIdFromRedux) {
            alert('로그인이 필요합니다.');
            navigate('/users/login');
        }
    }, [isLogin, userIdFromRedux, navigate, ]);

    useEffect(() => {
        // Redux 상태를 기반으로 로그인 여부를 판단
        // isLogin이 false 이거나 userIdFromRedux가 유효하지 않으면 로그인 페이지로 보냅니다.
        // console.log("VerifyPwd useEffect 실행 - isLogin:", isLogin, "userIdFromRedux:", userIdFromRedux);
        if (!isLogin || !userIdFromRedux) {
            alert('로그인이 필요합니다.');
            navigate('/users/login');
        }
    }, [isLogin, userIdFromRedux, navigate]); // isLogin과 userIdFromRedux가 바뀔 때만 실행

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
            const response = await axiosInstance.post('/users/verifypwd', { userId: userIdFromRedux, password });

            console.log("비밀번호 확인 요청 후", response.data);
            localStorage.setItem('isPasswordVerified', 'true');

            // 비밀번호 확인이 성공했으므로, 이제 UserEdit 페이지로 이동합니다.
            // 이 시점에서는 isLogin과 userIdFromRedux가 유효하므로, 
            // UserEdit 페이지의 PrivateRoute (만약 있다면) 검사를 통과할 것입니다.
            navigate('/users/edit');
        } catch (error) {
            console.error("비밀번호 확인 실패:", error);
            // 403 에러 처리: 백엔드에서 비밀번호 불일치도 403으로 보낼 수 있습니다.
            if (error.response && error.response.status === 403) {
                alert('비밀번호가 일치하지 않거나, 인증에 문제가 발생했습니다. 다시 로그인해 주세요.');
                // 추가적으로 로그아웃 처리 및 로그인 페이지 리다이렉트가 필요할 수 있습니다.
                // const dispatch = useDispatch(); // 이 컴포넌트에서 dispatch가 필요하다면 추가
                // dispatch(logout()); // 필요한 경우
                // navigate('/users/login'); // 필요한 경우
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