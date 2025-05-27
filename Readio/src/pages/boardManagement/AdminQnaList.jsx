import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/search.png';
import styles from './AdminQnaList.module.css';

function AdminQnaList() {
    const [qnas, setQnas] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    
    const pageSize = 7;
    const navigate = useNavigate();

    const fetchQnaPage = async (pageNumber = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/serviceCenter/qna/list/paging?page=${pageNumber}&size=${pageSize}`);
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();
            setQnas(data.content);
            setPage(data.number);
            setTotalPages(data.totalPages);
            setIsSearching(false);
        } catch (error) {
            console.error('QNA 불러오기 실패:', error);
        }
    };

    // ✳️ 검색 API 구현 전까지는 기본 리스트로만
    const fetchQnaSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/serviceCenter/qna/search?keyword=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();
            setQnas(data);
            setIsSearching(true);
        } catch (error) {
            console.error('QNA 검색 실패:', error);
        }
    };

    useEffect(() => {
        fetchQnaPage();
    }, []);

    const handleCheckboxChange = (qnaId) => {
        setSelectedIds((prev) => {
            const updated = prev.includes(qnaId)
                ? prev.filter((id) => id !== qnaId)
                : [...prev, qnaId];
            setIsAllSelected(updated.length === qnas.length);
            return updated;
        });
    };

    const handleAllCheckboxChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
            setIsAllSelected(false);
        } else {
            const allIds = qnas.map((qna) => qna.qnaId);
            setSelectedIds(allIds);
            setIsAllSelected(true);
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            alert('삭제할 QNA를 선택해주세요.');
            return;
        }
        if (!window.confirm('선택한 QNA를 삭제하시겠습니까?')) return;

        try {
            for (const id of selectedIds) {
                await fetch(`http://localhost:8080/serviceCenter/qna/delete/${id}`, {
                    method: 'DELETE',
                });
            }
            alert('삭제 완료');
            setSelectedIds([]);
            setIsAllSelected(false);
            isSearching ? fetchQnaSearch() : fetchQnaPage(page);
        } catch (error) {
            console.error('삭제 중 오류:', error);
            alert('삭제 실패');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            fetchQnaPage();
        } else {
            fetchQnaSearch();
        }
    };

    const handlePageClick = (pageNumber) => {
        fetchQnaPage(pageNumber);
    };

    return (
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>Q&A</span>
                    <div>
                        <button className={styles.delete} onClick={handleDelete}>삭제</button>
                    </div>
                </div>

                <div className={styles.line}></div>

                <div className={styles.tableBox}>
                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th><input type="checkbox" checked={isAllSelected} onChange={handleAllCheckboxChange} /></th>
                                <th>번호</th>
                                <th className={styles.titleSize}>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qnas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', paddingTop: '180px' }}>
                                        등록된 QNA가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                qnas.map((qna) => (
                                    <tr key={qna.qnaId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(qna.qnaId)}
                                                onChange={() => handleCheckboxChange(qna.qnaId)}
                                            />
                                        </td>
                                        <td>{qna.qnaId}</td>
                                        <td className={styles.titleCell}>
                                            <NavLink to={`/admin/qna/detail/${qna.qnaId}`} className={styles.contentBtn}>
                                                {qna.qnaTitle}
                                            </NavLink>
                                        </td>
                                        <td>{qna.qnaWriter || '사용자'}</td>
                                        <td>{new Date(qna.qnaCreateAt).toLocaleDateString()}</td>
                                        <td>{qna.qnaViewCount || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.mcontainer}>
                    <form className={styles.textcontainer} onSubmit={handleSearchSubmit}>
                        <input
                            className={styles.textbox}
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" className={styles.btn}>
                            <img src={searchIcon} alt="검색" />
                        </button>
                    </form>

                    {!isSearching && (
                        <div className={styles.pagingbox}>
                            <button className={styles.pageButton} onClick={() => handlePageClick(0)} disabled={page === 0}>{'<<'}</button>
                            <button className={styles.pageButton} onClick={() => handlePageClick(page - 1)} disabled={page === 0}>{'<'}</button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button key={index} className={styles.pageButton} onClick={() => handlePageClick(index)} style={{ fontWeight: index === page ? 'bold' : 'normal' }}>
                                    {index + 1}
                                </button>
                            ))}
                            <button className={styles.pageButton} onClick={() => handlePageClick(page + 1)} disabled={page === totalPages - 1}>{'>'}</button>
                            <button className={styles.pageButton} onClick={() => handlePageClick(totalPages - 1)} disabled={page === totalPages - 1}>{'>>'}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminQnaList;
