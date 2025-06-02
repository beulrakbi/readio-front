import { getFollowStatus, updateFollowStatusSuccess } from '../modules/follow/followModule.js';

// 인증 헤더를 가져오는 헬퍼 함수
const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    // console.log("FollowAPICalls 토큰:", token); // 필요시 주석 해제하여 토큰 확인
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 실제 백엔드 주소 (환경 변수 사용 권장)
const BASE_URL = 'http://localhost:8080';

/**
 * 팔로우 상태 확인 API (Thunk)
 * @param {number} targetProfileId - 팔로우 상태를 확인할 대상의 프로필 ID
 */
export const apiIsFollowingStatus = (targetProfileId) => {
    const requestURL = `${BASE_URL}/api/follow/${targetProfileId}/is-following`;
    console.log(`[FollowAPICalls] apiIsFollowingStatus THUNK initiated for targetProfileId: ${targetProfileId}. URL: ${requestURL}`);

    return async (dispatch) => {
        console.log(`[FollowAPICalls] apiIsFollowingStatus ASYNC function running for targetProfileId: ${targetProfileId}`);
        try {
            const response = await fetch(requestURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    ...getAuthHeader()
                }
            });
            console.log(`[FollowAPICalls] apiIsFollowingStatus: Response status: ${response.status}, ok: ${response.ok}`);

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.warn('[FollowAPICalls] apiIsFollowingStatus: Unauthorized/Forbidden.');
                    const errorPayload = { isFollowing: false, targetProfileId: targetProfileId, error: `Status ${response.status}` };
                    dispatch(getFollowStatus(errorPayload));
                    return { isFollowing: false }; // 컴포넌트에서 await으로 받을 경우를 대비 (선택적)
                }
                const errorData = await response.json().catch(() => ({ message: `Server error: ${response.statusText}` }));
                throw new Error(errorData.message || `팔로우 상태 확인 실패 (상태: ${response.status})`);
            }

            const result = await response.json(); // { isFollowing: boolean } 형태 예상
            console.log('[FollowAPICalls] apiIsFollowingStatus API RESULT:', result);

            const actionPayload = { 
                isFollowing: result.isFollowing, 
                targetProfileId: targetProfileId 
            };
            console.log("[FollowAPICalls] apiIsFollowingStatus: Dispatching getFollowStatus (success):", JSON.stringify(actionPayload));
            dispatch(getFollowStatus(actionPayload));

            return result; // 컴포넌트에서 await으로 받을 경우를 대비 (선택적)

        } catch (error) {
            console.error('[FollowAPICalls] apiIsFollowingStatus CATCH Exception:', error.message);
            const catchPayload = { isFollowing: false, targetProfileId: targetProfileId, error: error.message };
            dispatch(getFollowStatus(catchPayload));
            throw error; // 에러를 다시 throw하여 컴포넌트에서도 알 수 있게 함 (선택적)
        }
    };
};

/**
 * 팔로우 요청 API (Thunk)
 * @param {object} followRequestDTO - { followingProfileId: number }
 * @param {number} targetProfileId - 팔로우 대상의 프로필 ID (Redux 상태 업데이트 시 사용)
 */
export const apiFollowUser = (followRequestDTO, targetProfileId) => {
    const requestURL = `${BASE_URL}/api/follow`;
    console.log(`[FollowAPICalls] apiFollowUser THUNK initiated for targetProfileId: ${targetProfileId}. DTO:`, followRequestDTO);

    return async (dispatch) => {
        console.log(`[FollowAPICalls] apiFollowUser ASYNC function running for targetProfileId: ${targetProfileId}`);
        try {
            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                    ...getAuthHeader()
                },
                body: JSON.stringify(followRequestDTO)
            });
            console.log(`[FollowAPICalls] apiFollowUser: Response status: ${response.status}, ok: ${response.ok}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Server error: ${response.statusText}` }));
                // 400 Bad Request (예: 이미 팔로우 중) 등의 에러 메시지를 포함할 수 있음
                console.error('[FollowAPICalls] apiFollowUser Error:', errorData.message || `Status ${response.status}`);
                // 실패 시, 현재 상태를 유지하거나 에러 상태를 dispatch 할 수 있음
                // 여기서는 isFollowing을 true로 낙관적 업데이트 하지 않음.
                // 필요하다면 에러 액션을 dispatch: dispatch(updateFollowStatusError({ message: errorData.message, targetProfileId }))
                throw new Error(errorData.message || `팔로우 요청 실패 (상태: ${response.status})`);
            }

            const result = await response.json(); // 백엔드의 FollowResponseDTO
            console.log('[FollowAPICalls] apiFollowUser API RESULT:', result);

            const actionPayload = { 
                isFollowing: true, 
                targetProfileId: targetProfileId
            };
            console.log("[FollowAPICalls] apiFollowUser: Dispatching updateFollowStatusSuccess:", JSON.stringify(actionPayload));
            dispatch(updateFollowStatusSuccess(actionPayload));
            
            return result;

        } catch (error) {
            console.error('[FollowAPICalls] apiFollowUser CATCH Exception:', error.message);
            // dispatch(updateFollowStatusSuccess({ isFollowing: false, targetProfileId: targetProfileId, error: error.message })); // 필요시
            throw error;
        }
    };
};

/**
 * 언팔로우 요청 API (Thunk)
 * @param {number} targetProfileIdToUnfollow - 언팔로우할 대상의 프로필 ID
 */
export const apiUnfollowUser = (targetProfileIdToUnfollow) => {
    const requestURL = `${BASE_URL}/api/follow/${targetProfileIdToUnfollow}`;
    console.log(`[FollowAPICalls] apiUnfollowUser THUNK initiated for targetProfileId: ${targetProfileIdToUnfollow}`);
    
    return async (dispatch) => {
        console.log(`[FollowAPICalls] apiUnfollowUser ASYNC function running for targetProfileId: ${targetProfileIdToUnfollow}`);
        try {
            const response = await fetch(requestURL, {
                method: 'DELETE',
                headers: {
                    Accept: '*/*',
                    ...getAuthHeader()
                }
            });
            console.log(`[FollowAPICalls] apiUnfollowUser: Response status: ${response.status}, ok: ${response.ok}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Server error: ${response.statusText}` }));
                console.error('[FollowAPICalls] apiUnfollowUser Error:', errorData.message || `Status ${response.status}`);
                throw new Error(errorData.message || `언팔로우 요청 실패 (상태: ${response.status})`);
            }

            console.log('[FollowAPICalls] apiUnfollowUser SUCCESS (Status: 204 expected)');
            
            const actionPayload = { 
                isFollowing: false, 
                targetProfileId: targetProfileIdToUnfollow 
            };
            console.log("[FollowAPICalls] apiUnfollowUser: Dispatching updateFollowStatusSuccess:", JSON.stringify(actionPayload));
            dispatch(updateFollowStatusSuccess(actionPayload));
            
            return; // 204 No Content는 반환 바디가 없음

        } catch (error) {
            console.error('[FollowAPICalls] apiUnfollowUser CATCH Exception:', error.message);
            // dispatch(updateFollowStatusSuccess({ isFollowing: true, targetProfileId: targetProfileIdToUnfollow, error: error.message })); // 필요시
            throw error;
        }
    };
};