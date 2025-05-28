import { logout } from "./userSlice";

export const callLogoutAPI = () => {
    return async (dispatch) => {
        dispatch(logout());
    };
};