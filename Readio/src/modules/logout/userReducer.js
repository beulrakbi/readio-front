const initialState = {
    isLogin: false,
    userInfo: null
};

const LOGIN_SUCCESS = 'member/LOGIN_SUCCESS';
const LOGOUT = 'member/LOGOUT';

export const loginSuccess = (userInfo) => ({
    type: LOGIN_SUCCESS,
    payload: userInfo
});

export const logout = () => ({
    type: LOGOUT
});


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLogin: true,
                userInfo: action.payload
            };
        case LOGOUT:
            return {
                ...state,
                isLogin: false,
                userInfo: null
            };
        default:
            return state;
    }
};
export default userReducer;