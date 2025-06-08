import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 인증 헤더를 가져오는 헬퍼 함수
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 팔로워 목록을 가져오는 비동기 Thunk
export const getFollowersAPI = createAsyncThunk(
    'followList/getFollowers',
    async ({ profileId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8080/api/follow/${profileId}/followers`, {
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('팔로워 목록 조회에 실패했습니다.');
            return await response.json(); // 백엔드 응답 전체를 반환한다고 가정
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 팔로잉 목록을 가져오는 비동기 Thunk
export const getFollowingAPI = createAsyncThunk(
    'followList/getFollowing',
    async ({ profileId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8080/api/follow/${profileId}/following`, {
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error('팔로잉 목록 조회에 실패했습니다.');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    // pageInfo가 있다면 list와 pageInfo를 함께 관리, 없다면 list만 관리
    followers: { list: [], pageInfo: null },
    following: { list: [], pageInfo: null },
    isLoading: false,
    error: null,
};

const followListSlice = createSlice({
    name: 'followList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.isLoading = true;
            state.error = null;
        };
        const handleRejected = (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        };

        builder
            // 팔로워 조회 Thunk 처리
            .addCase(getFollowersAPI.pending, handlePending)
            .addCase(getFollowersAPI.fulfilled, (state, action) => {

                console.log("팔로워 리듀서가 받은 실제 데이터 (action.payload):", JSON.stringify(action.payload, null, 2));
                state.isLoading = false;
                // 백엔드 응답이 바로 배열이라면 action.payload, 객체 안에 있다면 action.payload.data 등으로 수정
                state.followers.list = action.payload; 
            })
            .addCase(getFollowersAPI.rejected, handleRejected)
            // 팔로잉 조회 Thunk 처리
            .addCase(getFollowingAPI.pending, handlePending)
            .addCase(getFollowingAPI.fulfilled, (state, action) => {

                console.log("팔로잉 리듀서가 받은 실제 데이터 (action.payload):", JSON.stringify(action.payload, null, 2));
                state.isLoading = false;
                state.following.list = action.payload;
            })
            .addCase(getFollowingAPI.rejected, handleRejected);
    }
});

export default followListSlice.reducer;