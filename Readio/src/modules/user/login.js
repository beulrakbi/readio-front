// import axios from "axios";
// import store from "../../Store.js";
// import { loginSuccess } from "./userSlice";

// export const login = (userId, password) => async (dispatch) => {
//     try {
//         const response = await axios.post('/users/login', { userId, password });
//         // JWT 토큰과 사용자 정보 받기
//         const { accessToken, userInfo } = response.data;
        
//         console.log('로그인 성공', response.data);
        
//         // 토큰 저장
//         localStorage.setItem('accessToken', accessToken);

        
//         // Redux 상태 갱신
//         console.log('사용자 정보:',store.getState());
//         dispatch(loginSuccess(userInfo));
//         // console.log('사용자 정보:', store.getState());
        
//     } catch (error) {
//         console.error('로그인 실패', error);
//         alert('로그인 실패: ' + error.response?.data?.message);
//     }
// };