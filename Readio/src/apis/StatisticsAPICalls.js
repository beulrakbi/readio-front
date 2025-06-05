import axios from 'axios';

/**
 * 클릭 수 기반 콘텐츠 목록 조회 (Top 클릭 영상 등)
 * @param {Object} params - 요청 파라미터 { type, sort, startDate, endDate, limit, page, size }
 * @returns {Promise}
 */


export async function getClickAnalytics(params) {
    try {
        const fullUrl = `/api/admin/analytics/clicks?${new URLSearchParams(params)}`;
        const token = sessionStorage.getItem("accessToken");

        const response = await fetch(fullUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("응답 상태 코드:", response.status);

            if (response.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                sessionStorage.removeItem("accessToken");  // 만료된 토큰 제거
                window.location.href = "/login";           // 로그인 페이지로 이동
                return;  // 이후 코드 실행 막기
            }

            throw new Error("API 실패");
        }

        return await response.json();
    } catch (err) {
        console.error("getClickAnalytics error:", err);
        throw err;
    }
}


/**
 * 북마크 수 기반 콘텐츠 목록 조회 (Top 북마크 영상/책)
 * @param {Object} params - 요청 파라미터 { type, limit }
 * @returns {Promise}
 */
export async function getBookmarkAnalytics(params) {
    try {
        const fullUrl = `/api/admin/analytics/bookmarks?${new URLSearchParams(params)}`;
        const token = sessionStorage.getItem("accessToken");

        const response = await fetch(fullUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("응답 상태 코드:", response.status);

            if (response.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                sessionStorage.removeItem("accessToken");  // 만료된 토큰 제거
                window.location.href = "/login";           // 로그인 페이지로 이동
                return;  // 이후 코드 실행 막기
            }

            throw new Error("API 실패");
        }

        return await response.json();
    } catch (err) {
        console.error("getBookmarkAnalytics error:", err);
        throw err;
    }
}

/**
 * 클릭 로그 저장 (영상/책 클릭 시 호출)
 * @param {Object} dto - ClickLogDTO
 * @returns {Promise}
 */
export async function saveClickLog(dto) {

    try {
        await axios.post('/api/clicks', dto);
    } catch (error) {
        console.error("saveClickLog error:", error);
        throw error;
    }
}

/**
 * 관심 키워드/카테고리 추세 조회
 * @param {Object} params - { type, granularity, startDate, endDate, sort, limit }
 * @returns {Promise}
 */
export async function getInterestTrend(params) {

    try {
        const fullUrl = `/api/admin/summary/interest-trend?${new URLSearchParams(params)}`;
        const token = sessionStorage.getItem("accessToken");

        const response = await fetch(fullUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("응답 상태 코드:", response.status);

            if (response.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                sessionStorage.removeItem("accessToken");  // 만료된 토큰 제거
                window.location.href = "/login";           // 로그인 페이지로 이동
                return;  // 이후 코드 실행 막기
            }

            throw new Error("API 실패");
        }

        return await response.json();
    } catch (err) {
        console.error("getClickAnalytics error:", err);
        throw err;
    }
}


/**
 * 두 달 간 관심 키워드/카테고리 비교
 * @param {Object} params - { type, month1, month2, sort, limit }
 * @returns {Promise}
 */
export async function getInterestDiff(params) {
    try {

        const fullUrl = `/api/admin/stats/interest-diff?${new URLSearchParams(params)}`;
        const token = sessionStorage.getItem("accessToken");

        const response = await fetch(fullUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("응답 상태 코드:", response.status);

            if (response.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                sessionStorage.removeItem("accessToken");  // 만료된 토큰 제거
                window.location.href = "/login";           // 로그인 페이지로 이동
                return;  // 이후 코드 실행 막기
            }

            throw new Error("API 실패");
        }

        return await response.json();
    } catch (err) {
        console.error("getClickAnalytics error:", err);
        throw err;
    }
}


/**
 * 사용자 행동 로그 저장
 * @param {Object} dto - UserBehaviorLogDTO
 * @returns {Promise}
 */
export async function saveUserBehaviorLog(dto) {
    try {
        await axios.post('/api/admin/user-behavior_log', dto);
    } catch (error) {
        console.error("saveUserBehaviorLog error:", error);
        throw error;
    }
}
