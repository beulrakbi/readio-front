import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../apis/axiosInstance";

const initialState = {
    isLogin: false, // 로그인 상태 초기값
    userInfo: null, // 사용자 정보 초기값
    accessToken: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { userId, userName, userRole, accessToken  } = action.payload;

            state.isLogin = true;
            state.userInfo = { userId, userName, userRole };
            state.accessToken = accessToken;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("userId", userId);
            localStorage.setItem("userName", userName);
            localStorage.setItem("userRole", JSON.stringify(userRole)); // 권한 배열 저장
            localStorage.setItem("isPasswordVerified", "true");
        },
        logout: (state) => {
            state.isLogin = false;
            state.userInfo = null;
            state.accessToken = null;

            // localStorage 정리
            // localStorage.removeItem("jwtToken"); 중복 삭제
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userRole");
            localStorage.removeItem("isPasswordVerified");
        },
    },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;

// 비동기 thunk 함수 (login, logout)
export const login = (userId, password) => async (dispatch) => {
    try {
        const response = await axios.post('/users/login', { userId, password });
        const { accessToken } = response.data;
        console.log('로그인 성공', response.data);

        const userInfoResponse = await axiosInstance.get('/users/me');
        const userInfo = userInfoResponse.data;

        dispatch(loginSuccess({
            userId: userInfo.userId,
            userName: userInfo.userName,
            userRole: userInfo.userRole,
            accessToken,
        }));
    } catch (error) {
        console.error('로그인 실패', error);
        alert('로그인 실패: ' + error.response?.data?.message);
    }
};

export const callLogoutAPI = () => (dispatch) => {
    // 토큰 삭제
    localStorage.removeItem('accessToken');
    dispatch(logout());
};