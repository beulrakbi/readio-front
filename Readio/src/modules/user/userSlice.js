import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLogin: false, // 로그인 상태 초기값
    userInfo: null, // 사용자 정보 초기값
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isLogin = true;
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.isLogin = false;
            state.userInfo = null;
        },
    },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;

// 비동기 thunk 함수 (login, logout)
export const login = (userId, password) => async (dispatch) => {
    try {
        const response = await axios.post('/users/login', { userId, password });
        const { accessToken, userInfo } = response.data;
        console.log('로그인 성공', response.data);
        localStorage.setItem('accessToken', accessToken);
        dispatch(loginSuccess(userInfo));
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