import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login.png';
import { loginSuccess } from '../../modules/user/userSlice';
import LoginCSS from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 정상작동 
        try {
            const response = await fetch("http://localhost:8080/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include" // 쿠키를 포함하여 요청
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "로그인 실패");
            }

            const data = await response.json();

            console.log("로그인 응답 data:", data);

            // 이거 있어야 로그인 가능 ? localStorage에 직접 정보 저장 (여기서 저장하는 것이 가장 명확)
            // localStorage.setItem("accessToken", data.accessToken);
            // localStorage.setItem("userId", data.userId); // 로그인한 사용자 ID 저장
            // localStorage.setItem("userName", data.userName); // 로그인한 사용자 이름 저장
            // localStorage.setItem("isPasswordVerified", "true"); // 비밀번호 검증 플래그 설정

            const userInfoResponse = await fetch("http://localhost:8080/users/me", {
                headers: {
                    "Authorization": `Bearer ${data.accessToken}`   //토큰
                },
                credentials: "include"
            });

            if (!userInfoResponse.ok) {
                throw new Error("사용자 정보 조회 실패");
            }

            const userInfo = await userInfoResponse.json();
            console.log("userInfo:", userInfo);

            const roles = userInfo.userRole || []; // roles: ["USER"], ["ADMIN"], ["SUSPENDED"]
            console.log("userInfo.role:", userInfo.userRole)

            dispatch(loginSuccess({
                userId: userInfo.userId, // 백엔드 응답 필드명 확인 (userID 또는 userId)
                userName: userInfo.userName,
                userRole: userInfo.userRole,
                isLoggedIn: true,
                accessToken: data.accessToken, // 로그인 상태를 true로 설정
            }));

            // 로그인 상태 저장
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("userInfo", JSON.stringify({
                userId: userInfo.userId,
                userName: userInfo.userName,
                userRole: userInfo.userRole,
            }));

            // 권한별 페이지로 이동
            if (roles.includes("ADMIN")) {
                navigate("/admin");
            } else if (roles.includes("SUSPENDED")) {
                navigate("/account/suspended");
            } else {
                navigate("/");
            }

        } catch (error) {
            alert(error.message || "로그인에 실패했습니다.");
            console.log("로그인 에러:", error);
        }
        console.log(formData);
    };


    return (
        <div className={LoginCSS.loginPage} style={{ backgroundImage: `url(${loginImage})` }}>
            <div className={LoginCSS.formContainer}>
                <h1 className={LoginCSS.companyName}>Readio :</h1>
                <div className={LoginCSS.description}>
                    "오늘 당신에게 필요한 한 문장은 무엇인가요?
                    <br />
                    readio에서 당신만의 이야기를 찾아보세요.
                    "
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={LoginCSS.inputGroup}>
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요"
                            required
                        />
                    </div>

                    <div className={LoginCSS.inputGroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                            required
                        />
                    </div>

                    <button type="submit" className={LoginCSS.submitBtn}>로그인</button>
                    <div className={LoginCSS.findLinks}>
                        <Link to="/account">아이디 찾기</Link>
                        <span className={LoginCSS.divider}>|</span>
                        <Link to="/account/findpwd">비밀번호 찾기</Link>
                    </div>
                </form>
            </div>
        </div>

    );
};
export default Login;