import { createSlice } from "@reduxjs/toolkit";

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

            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("userId", userId);
            sessionStorage.setItem("userName", userName);
            sessionStorage.setItem("userRole", JSON.stringify(userRole)); // 권한 배열 저장
            sessionStorage.setItem("isPasswordVerified", "true");

        },
        logout: (state) => {
            state.isLogin = false;
            state.userInfo = null;
            state.accessToken = null;

            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("isPasswordVerified");

        },
    },
});
export default userSlice.reducer;

export const { loginSuccess, logout } = userSlice.actions;

export const callLogoutAPI = () => (dispatch) => {

    // 토큰 삭제
    // localStorage.removeItem('accessToken');

    dispatch(logout());
};