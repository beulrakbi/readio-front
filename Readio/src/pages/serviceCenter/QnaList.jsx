import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from '../../components/board/common/Pagination';
import Search from '../../components/board/common/search';
import styles from './QnaList.module.css';

function QnaList() {
    const [qnaList, setQnaList] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const userId = localStorage.getItem('userId');

    const fetchQnaList = () => {
        let url = `http://localhost:8080/serviceCenter/qna/list/paging?page=${page}&size=7`;
        if (keyword.trim() !== '') {
            url = `http://localhost:8080/serviceCenter/qna/search?keyword=${keyword}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (keyword.trim() === '') {
                    setQnaList(data.content);
                    setTotalPages(data.totalPages);
                } else {
                    setQnaList(data);
                    setTotalPages(1);
                }
            })
            .catch(error => console.error('Qna 리스트 불러오기 실패:', error));
    };

    useEffect(() => {
        fetchQnaList();
    }, [page, keyword]);

    const handleSearch = (searchKeyword) => {
        setKeyword(searchKeyword);
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.smallHeader}>
                <span className={styles.smallHeaderElement}>Q&A 게시판</span>
                <div>
                    <NavLink to="/qna/writing" className={styles.writing}>글쓰기</NavLink>
                </div>
            </div>
            <div className={styles.line}></div>
            <ul className={styles.board}>
                <li className={styles.boardLi}>
                    <span>번호</span>
                    <span>제목</span>
                    <span>작성자</span>
                    <span>작성일</span>
                    <span>조회수</span>
                </li>
                {qnaList.length === 0 ? (
                    <li className={styles.postLi}>
                        <span className={styles.noPost}>게시글이 없습니다.</span>
                    </li>
                ) : (
                    qnaList.map((qna) => (
                        <li key={qna.qnaId} className={styles.postLi}>
                            <span>{qna.qnaId}</span>
                            <span className={styles.title}>
                                <NavLink to={`/qna/detail/${qna.qnaId}`} className={styles.titleLink}>
                                    {qna.qnaTitle}
                                </NavLink>
                            </span>
                            <span>{qna.userId}</span>
                            <span>{qna.qnaCreateAt ? qna.qnaCreateAt.split('T')[0] : ''}</span>
                            <span>{qna.qnaView}</span>
                        </li>
                    ))
                )}
            </ul>
            <div className={styles.mcontainer}>
                <Search onSearch={handleSearch} />
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}

export default QnaList;
