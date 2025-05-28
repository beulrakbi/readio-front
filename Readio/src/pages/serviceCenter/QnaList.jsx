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
    // 리스트 불러오기
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

    // 처음 로드, page, keyword 바뀔 때마다 호출
    useEffect(() => {
        fetchQnaList();
    }, [page, keyword]);

    // 검색 핸들러
    const handleSearch = (searchKeyword) => {
        setKeyword(searchKeyword);
        setPage(0); // 검색하면 페이지 0으로 초기화
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.smallHeader}>
                <span className={styles.smallHeaderElement}>Q&A 게시판</span>
                <div>
                    <button className={styles.writing}><NavLink to="/qna/writing" className={styles.writing}>글쓰기</NavLink></button>
                    <span className={styles.slash}>/</span>
                    <button className={styles.writing}>내가 쓴 글</button>
                </div>
            </div>
            <div className={styles.line}></div>
            <ul className={styles.board}>
                <li className={styles.boardLi}>
                    <span>게시글 번호</span>
                    <span>제목</span>
                    <div className={styles.boardLi2}>
                        <span>작성자</span>
                        <span>작성일</span>
                        <span>조회수</span>
                    </div>
                </li>
                {qnaList.length === 0 ? (
                    <li className={styles.postLi}>게시글이 없습니다.</li>
                ) : (
                    qnaList.map((qna) => (
                        <li key={qna.qnaId} className={styles.postLi}>
                            <span>{qna.qnaId}</span>
                            <div className={styles.postContext}>
                                <span>
                                    <NavLink to={`/qna/detail/${qna.qnaId}`} className={styles.titlecolor}>
                                        {qna.qnaTitle}
                                    </NavLink>                                
                                    </span>
                            </div>
                            <div className={styles.postLi2}>
                                <span>{qna.userId}</span>
                                <span>{qna.qnaCreateAt ? qna.qnaCreateAt.split('T')[0] : ''}</span>
                                <span>{qna.qnaView}</span>
                            </div>
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
