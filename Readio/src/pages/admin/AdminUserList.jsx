import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 회원목록 조회 테스트용 
function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchUserList();
    }, [currentPage, search]);

    const token = localStorage.getItem('jwtToken'); // 로그인 후 저장된 토큰 예시

    const fetchUserList = async () => {
        try {
            const response = await axios.get('/admin/users/list', {
                headers: {
                    Authorization: `Bearer ${token}`,  // 토큰 붙이기
                },
                params: {
                    page: currentPage,
                    size: pageSize,
                    search: search
                }
            });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('회원 목록 불러오기 오류', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // 검색어 변경 시 첫 페이지로
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>관리자 회원 목록</h2>

            {/* 🔍 검색창 */}
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="아이디, 이메일, 이름 검색"
                    value={search}
                    onChange={handleSearchChange}
                    style={{ width: '300px', padding: '5px' }}
                />
            </div>

            {/* 📋 회원 테이블 */}
            <table border="1" width="100%" cellPadding="8">
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>전화번호</th>
                        <th>생년월일</th>
                        <th>권한명</th>
                        <th>신고횟수</th>
                        <th>가입일</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.userName}</td>
                                <td>{user.userEmail}</td>
                                <td>{user.userPhone}</td>
                                <td>{user.userBirthday}</td>
                                <td>{user.userRoleName}</td>
                                <td>{user.reportCount}</td>
                                <td>{user.userCreatedAt}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>회원 정보가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 📄 페이징 */}
            <div style={{ marginTop: '10px' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        disabled={currentPage === index + 1}
                        style={{
                            margin: '2px',
                            padding: '5px 10px',
                            backgroundColor: currentPage === index + 1 ? '#ccc' : '#fff'
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default AdminUserList;
