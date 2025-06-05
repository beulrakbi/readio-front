import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./UserManagement.module.css";

function UserManagement() {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userTypes, setUserTypes] = useState({ 일반회원: false, 정지회원: false, 관리자: false });
    const [reportStatus, setReportStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const BACKEND_URL = "http://localhost:8080";
    const token = sessionStorage.getItem("accessToken");

    function formatToKST(utcDateStr) {
        if (!utcDateStr) return "";
        const date = new Date(utcDateStr);
        const kstTimestamp = date.getTime() + 9 * 60 * 60 * 1000;
        const kstDate = new Date(kstTimestamp);
        const year = kstDate.getFullYear();
        const month = String(kstDate.getMonth() + 1).padStart(2, "0");
        const day = String(kstDate.getDate()).padStart(2, "0");
        const hours = String(kstDate.getHours()).padStart(2, "0");
        const minutes = String(kstDate.getMinutes()).padStart(2, "0");
        const seconds = String(kstDate.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    // 한글 표시용 매핑 객체
    const roleDisplayName = {
        USER: "일반회원",
        ADMIN: "관리자",
        SUSPENDED: "정지회원",
    };



    const fetchUserList = async (page = currentPage) => {
        try {
            const selectedUserTypes = Object.entries(userTypes)
                .filter(([_, checked]) => checked)
                .map(([type]) => type);

            const params = {
                page: page,
                size: 20,
                searchType: searchType,
                searchValue: searchValue.trim() ? searchValue.trim() : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                userTypes: selectedUserTypes.length > 0 ? selectedUserTypes.join(",") : undefined,
                reportStatus: reportStatus || undefined,
            };

            console.log("요청 params:", params);

            const response = await axios.get(`${BACKEND_URL}/admin/users/list`, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            setUsers(response.data.users || response.data);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("회원 목록 불러오기 오류", error);
        }
    };



    useEffect(() => {
        fetchUserList();
    }, [currentPage]);


    /* 검색 버튼 */
    const handleSearch = () => {
        setCurrentPage(1);
        fetchUserList(1);
    };


    const handleUserTypeChange = (type) => {
        setUserTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    /* 권한 변경 */
    const handleRoleChange = async (userId, newEnglishRole) => {
        try {
            // 권한 변경 API 호출
            await axios.put(`${BACKEND_URL}/admin/users/${userId}/role`,
                { newRole: newEnglishRole }, // DTO 구조에 맞게
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await fetchUserList(currentPage);

            // setUsers((prevUsers) =>
            //     prevUsers.map((user) =>
            //         user.userId === userId ? { ...user, userRoleName: newEnglishRole } : user
            //     )
            // );

            console.log("권한 변경됨:", userId, newEnglishRole);
        } catch (error) {
            console.error("권한 변경 실패", error);
            alert("권한 변경에 실패했습니다.");
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    /* 검색할때 권한 체크박스 */
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const [roleChangeRequest, setRoleChangeRequest] = useState(null);

    {/* 삭제 버튼 */ }
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("정말 회원을 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${BACKEND_URL}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("회원이 삭제되었습니다.");
            fetchUserList(currentPage);  // 삭제 후 목록 갱신
        } catch (error) {
            console.error("회원 삭제 실패", error);
            alert("회원 삭제에 실패했습니다.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <hr className={styles.line1} />
            <h2>&nbsp;&nbsp;&nbsp;회원관리</h2>
            <hr className={styles.line1} />

            {/* 조건 검색 영역 */}
            <div className={styles.searchSection}>
                <div className={styles.rowGroup}>
                    <div className={styles.row}>
                        <label>조건검색</label>
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={styles.selectBox}>
                            <option value="id">아이디</option>
                            <option value="email">이메일</option>
                        </select>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="검색어 입력"
                            className={styles.inputBox}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>회원구분</label>
                        {Object.keys(userTypes).map((type) => (
                            <label key={type} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={userTypes[type]}
                                    onChange={() => handleUserTypeChange(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.rowGroup}>
                    <div className={styles.row}>
                        <label>가입일자</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.dateInput} />
                        <span>~</span>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.dateInput} />
                    </div>

                    <div className={styles.row}>
                        <label>신고횟수</label>
                        <select value={reportStatus} onChange={(e) => setReportStatus(e.target.value)} className={styles.selectBox}>
                            <option value="">전체</option>
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                        </select>
                    </div>
                </div>

                <button onClick={handleSearch} className={styles.searchButton}>검색</button>
            </div>

            {/* 회원 테이블 */}
            <table className={styles.table}>
                <thead className={styles.tableHead}>
                    <tr>
                        <th>번호</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>가입일자</th>
                        <th>구분</th>
                        <th>신고횟수</th>
                        <th>권한변경</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.userId}>
                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                <td><span onClick={() => handleUserClick(user)} className={styles.userIdClickable}>
                                    {user.userId}
                                </span>
                                </td>
                                <td>{user.userName}</td>
                                <td>{user.userEmail}</td>
                                <td>{formatToKST(user.userEnrollDate)}</td>
                                <td>{roleDisplayName[user.userRoleName] || user.userRoleName}</td>
                                <td>{user.reportCount}</td>

                                <td>
                                    <select
                                        value={user.userRole}
                                        onChange={(e) => {
                                            const newRole = e.target.value;
                                            if (newRole === user.userRole) return; // 변경 없으면 무시

                                            // 권한 변경 요청 상태 저장 -> 모달 띄움
                                            setRoleChangeRequest({
                                                userId: user.userId,
                                                currentRole: user.userRole,
                                                newRole: newRole,
                                            });
                                        }}
                                        className={styles.roleSelect}
                                    >
                                        <option value="USER">일반회원</option>
                                        <option value="SUSPENDED">정지회원</option>
                                        <option value="ADMIN">관리자</option>
                                    </select>
                                </td>


                                <td><button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteUser(user.userId)}>삭제</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="8" style={{ textAlign: "center" }}>회원 정보가 없습니다.</td></tr>
                    )}
                </tbody>
            </table>

            {/* 권한변경 시 모달창 */}
            {roleChangeRequest && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalRoleTitleBox}>
                        <h3 className={styles.modalRoleTitle}>권한 변경 확인</h3>
                        <p className={styles.modalRoleContent}>
                            회원 아이디: <b>{roleChangeRequest.userId}</b><br />
                            <b>{roleDisplayName[roleChangeRequest.currentRole]}</b> ▶️ <b>{roleDisplayName[roleChangeRequest.newRole]}</b> (으)로 변경하시겠습니까?
                        </p>
                        <div className={styles.modalButtons}>
                            <button
                                onClick={async () => {
                                    // 권한 변경 API 호출
                                    await handleRoleChange(roleChangeRequest.userId, roleChangeRequest.newRole);
                                    setRoleChangeRequest(null); // 모달 닫기
                                }}
                            >
                                확인
                            </button>
                            <button onClick={() => setRoleChangeRequest(null)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 페이지네이션 */}
            <div className={styles.pagination}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                {[...Array(totalPages)].map((_, index) => (
                    <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? styles.activePage : ""}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
            </div>

            {/* 회원 상세정보 확인 모달 */}
            {isModalOpen && selectedUser && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalTitle}>{selectedUser.userId} 님의 회원정보입니다.</div>
                        <div className={styles.sectionTitle}>회원 상세 정보</div>
                        <hr className={styles.line2} />
                        <table className={styles.detailTable}>
                            <tbody>
                                <tr><td className={styles.modalLabel}>이름</td><td>{selectedUser.userName}</td></tr>
                                <tr><td className={styles.modalLabel}>아이디</td><td>{selectedUser.userId}</td></tr>
                                <tr><td className={styles.modalLabel}>이메일</td><td>{selectedUser.userEmail}</td></tr>
                                <tr><td className={styles.modalLabel}>휴대폰번호</td><td>{selectedUser.userPhone}</td></tr>
                                <tr><td className={styles.modalLabel}>생년월일</td><td>{selectedUser.userBirthday}</td></tr>
                                <tr><td className={styles.modalLabel}>회원권한</td><td>{selectedUser.userRoleName}</td></tr>
                                <tr><td className={styles.modalLabel}>가입일자</td><td>{formatToKST(selectedUser.userEnrollDate)}</td></tr>
                            </tbody>
                        </table>
                        <div className={styles.closeModal}><button className={styles.closeBtn} onClick={closeModal}>닫기</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
