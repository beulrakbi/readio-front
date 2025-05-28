import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/search.png';
import styles from './AdminFaqList.module.css';

function AdminFaqList() {
    const [faqs, setFaqs] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const pageSize = 7;
    const navigate = useNavigate();

    const fetchFaqPage = async (pageNumber = 0) => {
        try {
            const response = await fetch(`http://localhost:8080/serviceCenter/faq/list/paging?page=${pageNumber}&size=${pageSize}`);
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();
            setFaqs(data.content);
            setPage(data.number);
            setTotalPages(data.totalPages);
            setIsSearching(false);
        } catch (error) {
            console.error('FAQ를 불러오는데 실패했습니다:', error);
        }
    };

    const fetchFaqSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/serviceCenter/faq/search?keyword=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();
            setFaqs(data);
            setIsSearching(true);
        } catch (error) {
            console.error('FAQ 검색 실패:', error);
        }
    };

    useEffect(() => {
        fetchFaqPage();
    }, []);

    const handleCheckboxChange = (faqId) => {
        setSelectedIds((prev) => {
            const updated = prev.includes(faqId)
                ? prev.filter((id) => id !== faqId)
                : [...prev, faqId];
            setIsAllSelected(updated.length === faqs.length);
            return updated;
        });
    };

    const handleAllCheckboxChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
            setIsAllSelected(false);
        } else {
            const allIds = faqs.map((faq) => faq.faqId);
            setSelectedIds(allIds);
            setIsAllSelected(true);
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            alert('삭제할 FAQ를 선택해주세요.');
            return;
        }
        if (!window.confirm('선택한 FAQ를 삭제하시겠습니까?')) return;

        try {
            for (const id of selectedIds) {
                await fetch(`http://localhost:8080/serviceCenter/faq/delete/${id}`, {
                    method: 'DELETE',
                });
            }
            alert('삭제가 완료되었습니다.');
            setSelectedIds([]);
            setIsAllSelected(false);
            isSearching ? fetchFaqSearch() : fetchFaqPage(page);
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const handleTitleClick = (faqId) => {
        navigate(`/admin/faq/edit/${faqId}`);
    };

    const handlePageClick = (pageNumber) => {
        fetchFaqPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            fetchFaqPage(); // 빈 검색어이면 전체 조회로 되돌리기
        } else {
            fetchFaqSearch();
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>FAQ</span>
                    <div>
                        <button className={styles.writing}>
                            <NavLink to="/admin/faq/writing" className={styles.titlecolor}>글쓰기</NavLink>
                        </button>
                        <span className={styles.slash}>/</span>
                        <button className={styles.delete} onClick={handleDelete}>삭제</button>
                    </div>
                </div>

                <hr className={styles.line}></hr>

                <div className={styles.tableBox}>
                    <table className={styles.noticeTable}>
                        <thead>
                        <tr>
                            <th><input type="checkbox" checked={isAllSelected} onChange={handleAllCheckboxChange}/></th>
                            <th>번호</th>
                            <th className={styles.titleSize}>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {faqs.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{
                                    textAlign: 'center',
                                    paddingTop: '180px',
                                    fontSize: '20px',
                                    color: '#3838383'
                                }}>
                                    등록된 FAQ가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            faqs.map((faq) => (
                                <tr key={faq.faqId}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(faq.faqId)}
                                            onChange={() => handleCheckboxChange(faq.faqId)}
                                        />
                                    </td>
                                    <td>{faq.faqId}</td>
                                    <td className={styles.titleCell}>
                                            <span
                                                onClick={() => handleTitleClick(faq.faqId)}
                                                style={{cursor: 'pointer', color: 'black', textDecoration: 'none'}}
                                            >
                                                {faq.faqTitle}
                                            </span>
                                    </td>
                                    <td>관리자</td>
                                    <td>{new Date(faq.faqCreateAt).toLocaleString()}</td>
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
                            <img src={searchIcon} alt="검색"/>
                        </button>
                    </form>

                    {!isSearching && (
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
                                    style={{fontWeight: index === page ? 'bold' : 'normal'}}
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
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminFaqList;
