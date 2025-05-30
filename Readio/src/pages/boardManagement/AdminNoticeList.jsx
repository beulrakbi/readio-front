import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/search.png';
import styles from './AdminNoticeList.module.css';

function AdminNoticeList() {
    const [notices, setNotices] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); 

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 7;

    const [searchQuery, setSearchQuery] = useState('');

    const noticePage = async (pageNumber = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/serviceCenter/notice/list/paging?page=${pageNumber}&size=${pageSize}`);
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();

            setNotices(data.content);
            setPage(data.number);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('공지사항을 불러오는데 실패했습니다:', error);
        }
    };

    useEffect(() => {
        noticePage();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await fetch('http://localhost:8080/serviceCenter/notice/list');
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();
            setNotices(data);
        } catch (error) {
            console.error('공지사항을 불러오는데 실패했습니다:', error);
        }
    };

    const handleCheckboxChange = (noticeId) => {
        setSelectedIds((prev) => {
            const updated = prev.includes(noticeId)
                ? prev.filter((id) => id !== noticeId)
                : [...prev, noticeId];
            setIsAllSelected(updated.length === notices.length);
            return updated;
        });
    };

    const handleAllCheckboxChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
            setIsAllSelected(false);
        } else {
            const allIds = notices.map((notice) => notice.noticeId);
            setSelectedIds(allIds);
            setIsAllSelected(true);
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            alert('삭제할 공지사항을 선택해주세요.');
            return;
        }
        if (!window.confirm('선택한 공지사항을 삭제하시겠습니까?')) return;

        try {
            for (const id of selectedIds) {
                await fetch(`http://localhost:8080/serviceCenter/notice/delete/${id}`, {
                    method: 'DELETE',
                });
            }
            alert('삭제가 완료되었습니다.');
            setSelectedIds([]);
            setIsAllSelected(false);
            fetchNotices();
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const fetchNoticeSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/serviceCenter/notice/search?keyword=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();
            setNotices(data); // ✅ 검색 결과로 목록 변경
            setPage(0);
            setTotalPages(1); // 필요 시 서버 응답에 따라 조정
        } catch (error) {
            console.error('공지사항 검색 실패:', error);
        }
    };

    const handlePageClick = (pageNumber) => {
        noticePage(pageNumber);
    };

    const handleTitleClick = (noticeId) => {
        navigate(`/admin/notice/edit/${noticeId}`);
    };

    return (
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>공지사항</span>
                    <div>
                        <button className={styles.writing}>
                            <NavLink to="/admin/notice/writing" className={styles.titlecolor}>글쓰기</NavLink>
                        </button>
                        <span className={styles.slash}>/</span>
                        <button className={styles.delete} onClick={handleDelete}>삭제</button>
                    </div>
                </div>

                <hr className={styles.line}></hr>

                <div className={styles.tableBox}>
                    <table className={styles.noticeTable}>
                        <thead>
                            <tr style={{borderBottom: '1px solid #383838'}}>
                                <th><input type="checkbox" checked={isAllSelected} onChange={handleAllCheckboxChange} /></th>
                                <th>번호</th>
                                <th>상태</th>
                                <th className={styles.titleSize}>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', paddingTop: '180px', fontSize:'20px', color: '#3838383' }}>
                                        등록된 공지사항이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                notices.map((notice) => (
                                    <tr key={notice.noticeId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(notice.noticeId)}
                                                onChange={() => handleCheckboxChange(notice.noticeId)}
                                            />
                                        </td>
                                        <td>{notice.noticeId}</td>
                                        <td>{notice.noticeState === 'TEMPORARY' ? '단기' :
                                            notice.noticeState === 'URGENT' ? '긴급' : '종료'}</td>
                                        <td className={styles.titleCell}>
                                            <span
                                                onClick={() => handleTitleClick(notice.noticeId)}
                                                style={{ cursor: 'pointer', color: 'black', textDecoration: 'none' }}
                                            >
                                                {notice.noticeTitle}
                                            </span>
                                        </td>
                                        <td>{notice.userId}</td>
                                        <td>{new Date(notice.noticeCreateAt).toLocaleString()}</td>
                                        <td>{notice.noticeView}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.mcontainer}>
                    <div className={styles.textcontainer}>
                        <input
                            className={styles.textbox}
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    fetchNoticeSearch();
                                }
                            }}
                        />
                        <button className={styles.btn} onClick={fetchNoticeSearch}>
                            <img src={searchIcon} alt="검색" />
                        </button>
                    </div>
                    <div className={styles.pagingbox}>
                        <button
                            className={styles.pageButton}
                            onClick={() => handlePageClick(0)}
                            disabled={page === 0}
                        >
                            {'<<'}
                        </button>
                        <button
                            className={styles.pageButton}
                            onClick={() => handlePageClick(page - 1)}
                            disabled={page === 0}
                        >
                            {'<'}
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={styles.pageButton}
                                style={{ fontWeight: index === page ? 'bold' : 'normal' }}
                                onClick={() => handlePageClick(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className={styles.pageButton}
                            onClick={() => handlePageClick(page + 1)}
                            disabled={page === totalPages - 1}
                        >
                            {'>'}
                        </button>
                        <button
                            className={styles.pageButton}
                            onClick={() => handlePageClick(totalPages - 1)}
                            disabled={page === totalPages - 1}
                        >
                            {'>>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminNoticeList;
