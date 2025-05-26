import { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from '../../assets/login.png';
import LoginCSS from './Login.module.css';

const Login = () => {
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
                throw new Error("로그인 실패");
            }

            const data = await response.json();

            localStorage.setItem("accessToken", data.accessToken);

            window.location.href = "/";

        } catch (error) {
            alert("로그인에 실패했습니다.");
            console.log(error);
        }
        console.log(formData);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const response = await fetch("http://localhost:8080/users/login", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(formData),
    //             credentials: "include"
    //         });

    //         if (!response.ok) {
    //             throw new Error("로그인 실패");
    //         }

    //         const data = await response.json();

    //         localStorage.setItem("accessToken", data.accessToken);

    //         window.location.href = "/";

    //     } catch (error) {
    //         alert("로그인에 실패했습니다.");
    //         console.log(error);
    //     }
    // };



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