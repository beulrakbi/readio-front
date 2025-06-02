import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./UserManagement.module.css";

function UserManagement() {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userTypes, setUserTypes] = useState({
        일반회원: false, 정지회원: false, 관리자: false
    });
    const [reportStatus, setReportStatus] = useState("");
    // const [userRole, setUserRole] = useState("일반회원");

    /* 페이지네이션 */
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const totalPages = 10; // 예시로 10페이지로 설정

    /* 회원 리스트 */
    const [users, setUsers] = useState([]);

    // 선택한 회원 정보(모달)
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const BACKEND_URL = "http://localhost:8080";        // 백엔드 서버
    const token = sessionStorage.getItem("accessToken");  // 5.30 변경 테스트중

    const fetchUserList = async () => {
        try {
            // 회원구분 체크박스 필터링: 선택된 유형만 배열로 만들기
            const selectedUserTypes = Object.entries(userTypes)
                .filter(([_, checked]) => checked)
                .map(([type]) => type);

            const params = {
                page: currentPage,
                size: 10,
                searchType: searchType,
                searchValue: searchValue,
                startDate: startDate,
                endDate: endDate,
                userTypes: selectedUserTypes.length > 0 ? selectedUserTypes.join(",") : undefined,
                reportStatus: reportStatus || undefined,
            };

            const response = await axios.get(`${BACKEND_URL}/admin/users/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });

            // 응답 데이터 예시 형태에 맞게 맞춤 필요
            setUsers(response.data.users || response.data); // users 배열로 가정
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("회원 목록 불러오기 오류", error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, [currentPage]);

    // 검색 버튼 클릭 시
    const handleSearch = () => {
        setCurrentPage(1); // 검색 시 첫 페이지부터 조회
        fetchUserList();
        console.log({ searchType, searchValue, startDate, endDate, userTypes, reportStatus });
    };

    const handleUserTypeChange = (type) => {
        setUserTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };



    // 권한 변경: 각 사용자별 권한 변경 상태를 따로 관리하려면 users 상태를 업데이트하는 로직 필요
    const handleRoleChange = (userId, newRole) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.userId === userId ? { ...user, userRoleName: newRole } : user
            )
        );
        console.log("권한 변경됨:", userId, newRole);
        // 서버 API 호출로 변경 반영 필요 (추가 구현)
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            console.log('페이지 변경:', page);
        }
    };

    /* 모달 핸들러 (아이디 클릭시 오픈)*/
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
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
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={styles.dateInput}
                        />
                        <span>~</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={styles.dateInput}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>신고횟수</label>
                        <select
                            value={reportStatus}
                            onChange={(e) => setReportStatus(e.target.value)}
                            className={styles.selectBox}
                        >
                            <option value="">전체</option>
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                        </select>
                    </div>
                </div>

                <button onClick={handleSearch} className={styles.searchButton}>
                    검색
                </button>
            </div>


            {/* 회원 테이블 */}
            <table className={styles.table}>
                <thead className={styles.tableHead}>
                    <tr>
                        <th>번호</th>
                        <th>아이디</th>
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
                                <td>
                                    <span
                                        onClick={() => handleUserClick(user)}
                                        className={styles.userIdClickable}
                                    >
                                        {user.userId}
                                    </span>
                                </td>
                                <td>{user.userEmail}</td>
                                <td>{user.userEnrollDate}</td>
                                <td>{user.userRoleName}</td>
                                <td>{user.reportCount}</td>
                                <td>
                                    <select
                                        value={user.userRoleName}
                                        onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                                        className={styles.roleSelect}
                                    >
                                        <option value="일반회원">일반회원</option>
                                        <option value="정지회원">정지회원</option>
                                        <option value="관리자">관리자</option>
                                    </select>
                                </td>
                                <td>
                                    <button className={styles.deleteButton}>삭제</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center" }}>
                                회원 정보가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>&lt;
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? styles.activePage : ""}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>&gt;
                </button>
            </div>
            {/* 페이지네이션 끝*/}


            {/* 모달 */}
            {isModalOpen && selectedUser && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalTitle}>{selectedUser.userId} 님의 회원정보입니다.</div>

                        <div className={styles.sectionTitle}>회원 상세 정보</div>
                        <hr className={styles.line2} />

                        <table className={styles.detailTable}>
                            <tbody>
                                <tr>
                                    <td className={styles.modalLabel}>이름</td>
                                    <td>{selectedUser.userName}</td>
                                </tr>
                                <tr>
                                    <td className={styles.modalLabel}>아이디</td>
                                    <td>{selectedUser.userId}</td>
                                </tr>
                                <tr>
                                    <td className={styles.modalLabel}>이메일</td>
                                    <td>{selectedUser.userEmail}</td>
                                </tr>
                                <tr>
                                    <td className={styles.modalLabel}>휴대폰번호</td>
                                    <td>{selectedUser.userPhone}</td>
                                </tr>
                                <tr>
                                    <td className={styles.modalLabel}>생년월일</td>
                                    <td>{selectedUser.userBirthday}</td>
                                </tr>
                                <tr>
                                    <td className={styles.modalLabel}>회원권한</td>
                                    <td>{selectedUser.userRoleName}</td>
                                </tr>
                                <tr>
                                    <td className={styles.modalLabel}>가입일자</td>
                                    <td>{selectedUser.userEnrollDate}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className={styles.closeModal}>
                            <button className={styles.closeBtn} onClick={closeModal}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} export default UserManagement;
