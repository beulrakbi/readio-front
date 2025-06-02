import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // useNavigate 추가
import Pagination from '../../components/board/common/Pagination';
import Search from '../../components/board/common/search';
import styles from './QnaList.module.css';

function QnaList() {
    const [qnaList, setQnaList] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 추가

    // accessToken의 존재 여부로 로그인 상태를 판단합니다.
    // userId만으로는 토큰 만료 여부를 알 수 없으므로 accessToken을 사용하는 것이 더 정확합니다.
    const accessToken = sessionStorage.getItem('accessToken');

    const fetchQnaList = () => {
        let url = `http://localhost:8080/serviceCenter/qna/list/paging?page=${page}&size=7`;
        if (keyword.trim() !== '') {
            url = `http://localhost:8080/serviceCenter/qna/search?keyword=${keyword}`;
        }

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                return res.json();
            })
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

    // '글쓰기' 버튼 클릭 핸들러
    const handleWriteClick = (e) => {
        if (!accessToken) { // accessToken이 없으면 로그인하지 않은 상태로 간주
            e.preventDefault(); // NavLink의 기본 페이지 이동 동작을 막음
            alert('회원만 질문할 수 있습니다. 로그인 후 이용해 주세요.');
            // 필요에 따라 로그인 페이지로 리디렉션
            // navigate('/users/login');
        }
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.smallHeader}>
                <span className={styles.smallHeaderElement}>Q&A 게시판</span>
                <div>
                    <NavLink
                        to="/qna/writing"
                        className={styles.writing}
                        onClick={handleWriteClick} // 클릭 이벤트 핸들러 추가
                    >
                        글쓰기
                    </NavLink>
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