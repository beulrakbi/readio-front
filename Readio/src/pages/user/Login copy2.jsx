// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../apis/axiosInstance';
// import loginImage from '../../assets/login.png';
// import LoginCSS from './Login.module.css';

// const Login = () => {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         username: '',
//         password: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axiosInstance.post("/users/login", formData);


//             // if (!response.ok) {
//             //     const errorData = response.data;
//             //     throw new Error(errorData.message || "로그인 실패");
//             // }

//             // const data = await response.json();
//             const data = response.data
//             console.log("로그인 응답 data:", data);

//             localStorage.setItem("jwtToken", data.accessToken);
//             localStorage.setItem("userId", data.userId); // 로그인한 사용자 ID 저장
//             localStorage.setItem("userName", data.userName); // 로그인한 사용자 이름 저장
//             localStorage.setItem("isPasswordVerified", "true"); // 비밀번호 검증 플래그 설정

//             window.location.href = "/";

//             const token = localStorage.getItem("jwtToken");
//             console.log("axios 토큰 확인:", token); // 토큰이 null이면 저장이 안된것 배포전 삭제필요

//             // 토큰 저장 후 사용자 정보 조회
//             const userInfoResponse = await axiosInstance.get("/users/me");

//             const userInfo = userInfoResponse.data;
//             console.log("userInfo:", userInfo);

//             // if (userInfoResponse.status !== 200) {
//             //     throw new Error("사용자 정보 조회 실패");
//             // }

//             const roles = userInfo.userRole || []; // roles: ["USER"], ["ADMIN"], ["SUSPENDED"]
//             console.log("userInfo.role:", userInfo.userRole)

//             // 권한별 페이지로 이동
//             if (roles.includes("ADMIN")) {
//                 navigate("/admin");
//             } else if (roles.includes("SUSPENDED")) {
//                 navigate("/account/suspended");
//             } else {
//                 navigate("/");
//             }

//         } catch (error) {
//             alert(error.response?.data?.message || "로그인에 실패했습니다.");
//             console.log("로그인 에러:", error);
//         }
//         console.log(formData);
//     };


//     return (

//         <div className={LoginCSS.loginPage} style={{ backgroundImage: `url(${loginImage})` }}>
//             <div className={LoginCSS.formContainer}>
//                 <h1 className={LoginCSS.companyName}>Readio :</h1>
//                 <div className={LoginCSS.description}>
//                     "오늘 당신에게 필요한 한 문장은 무엇인가요?
//                     <br />
//                     readio에서 당신만의 이야기를 찾아보세요.
//                     "
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className={LoginCSS.inputGroup}>
//                         <label htmlFor="username">아이디</label>
//                         <input
//                             type="text"
//                             id="username"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             placeholder="아이디를 입력하세요"
//                             required
//                         />
//                     </div>

//                     <div className={LoginCSS.inputGroup}>
//                         <label htmlFor="password">비밀번호</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder="비밀번호를 입력하세요"
//                             required
//                         />
//                     </div>

//                     <button type="submit" className={LoginCSS.submitBtn}>로그인</button>
//                     <div className={LoginCSS.findLinks}>
//                         <Link to="/account">아이디 찾기</Link>
//                         <span className={LoginCSS.divider}>|</span>
//                         <Link to="/account/findpwd">비밀번호 찾기</Link>
//                     </div>
//                 </form>
//             </div>
//         </div>

//     );
// };
// export default Login;