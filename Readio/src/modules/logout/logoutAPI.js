import { logout } from "./userReducer";

export const callLogoutAPI = () => {
    return async (dispatch) => {
        dispatch(logout());
    };
};