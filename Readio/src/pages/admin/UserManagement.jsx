import { useState } from "react";
import styles from "./UserManagement.module.css";

function UserManagement() {
    const [searchType, setSearchType] = useState("id");
    const [searchValue, setSearchValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [userTypes, setUserTypes] = useState({ 일반회원: false, 정지회원: false, 관리자: false });
    const [reportStatus, setReportStatus] = useState("");
    const [userRole, setUserRole] = useState("일반회원");

    /* 페이지네이션 */
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10; // 예시로 10페이지로 설정

    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUserTypeChange = (type) => {
        setUserTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const handleSearch = () => {
        console.log({ searchType, searchValue, startDate, endDate, userTypes, reportStatus });
    };

    const handleRoleChange = (e) => {
        setUserRole(e.target.value);
        console.log("권한 변경됨:", e.target.value);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            console.log('페이지 변경:', page);
        }
    }

    /* 모달 핸들러 (아이디 클릭시)*/
    const handleUserClick = (userId) => {
        setSelectedUser(userId); // 실제로는 전체 사용자 객체를 설정할 것
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
                        <th>이메일</th>
                        <th>가입일자</th>
                        <th>구분</th>
                        <th>신고횟수</th>
                        <th>권한변경</th>
                        <th>삭제</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>1</td>
                        <td>
                            <span onClick={() => handleUserClick("user01")} className={styles.userIdClickable}>
                                user01
                            </span>
                        </td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td>user02</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>3</td>
                        <td>user03</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>4</td>
                        <td>user04</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>5</td>
                        <td>user05</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>6</td>
                        <td>user06</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>7</td>
                        <td>user07</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>8</td>
                        <td>user08</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>9</td>
                        <td>user09</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>

                    <tr>
                        <td>10</td>
                        <td>user10</td>
                        <td>user01@example.com</td>
                        <td>2024-12-01</td>
                        <td>일반회원</td>
                        <td>Y</td>
                        <td>
                            <select value={userRole} onChange={handleRoleChange} className={styles.roleSelect}>
                                <option value="일반회원">일반회원</option>
                                <option value="정지회원">정지회원</option>
                                <option value="관리자">관리자</option>
                            </select>
                        </td>
                        <td>
                            <button className={styles.deleteButton}>삭제</button>
                        </td>
                    </tr>
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
                )
                )}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>&gt;
                </button>
            </div>
            {/* 페이지네이션 끝*/}


            {/* 모달 */}
            {
                isModalOpen && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                            <div className={styles.modalTitle}>{selectedUser} 님의 회원정보입니다.</div>


                            <div className={styles.sectionTitle}>회원 상세 정보</div>

                            <hr className={styles.line2} />

                            <table className={styles.detailTable}>
                                <tbody>
                                    <tr>
                                        <td className={styles.modalLabel}>이름 </td>
                                        <td>{selectedUser.name}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.modalLabel}>아이디 </td>
                                        <td>{selectedUser}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.modalLabel}>이메일 </td>
                                        <td>{selectedUser.email}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.modalLabel}>휴대폰번호 </td>
                                        <td>{selectedUser.phone}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.modalLabel}>생년월일 </td>
                                        <td>{selectedUser.birthDate}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.modalLabel}>회원권한 </td>
                                        <td>{selectedUser.birthDate}</td>
                                    </tr>
                                    <tr>
                                        <td className={styles.modalLabel}>가입일자 </td>
                                        <td>{selectedUser.birthDate}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className={styles.closeModal}>
                                <button className={styles.closeBtn} onClick={closeModal}>닫기</button>
                            </div>
                        </div>
                    </div>

                )
            }
        </div>

    );
}
export default UserManagement;