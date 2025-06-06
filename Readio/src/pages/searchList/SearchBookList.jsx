import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './SearchBookList.module.css';
import SearchBox from './SearchBox.jsx'; // SearchBox 컴포넌트 임포트

function SearchBookList() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [input, setInput] = useState('');    // 검색창 입력값
    const [query, setQuery] = useState('');    // 실제 요청에 쓰일 키워드
    const [page, setPage] = useState(1);       // 현재 페이지 
    const [books, setBooks] = useState([]);    // API 응답 도서 목록
    const [totalCount, setTotalCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const size = 10;
    const MAX_TOTAL = 100; // 최대 전체 결과 개수
    const MAX_PAGES = 10; // 최대 페이지 수

    // URL 쿼리 파싱: query, page 초기화
    useEffect(() => {
        const qp = new URLSearchParams(location.search);
        const q = qp.get('query') || '';
        const p = parseInt(qp.get('page'), 10) || 1;
        setInput(q);
        setQuery(q);
        setPage(p);
    }, [location.search]);

    // 실제 API 호출: query 또는 page 가 바뀔 때마다
    useEffect(() => {
        if (!query) {
            setBooks([]);
            setTotalCount(0);
            return;
        }

        setErrorMessage('');
        fetch(`http://localhost:8080/search/book?query=${encodeURIComponent(query)}&page=${page}&size=${size}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                const { data } = json;
                if (!data || !Array.isArray(data.books)) {
                setErrorMessage('서버 응답이 올바르지 않습니다.');
                setBooks([]);
                setTotalCount(0);
                return;
                }

                setBooks(data.books);

                // totalCount는 data.total과 MAX_TOTAL 중 작은 값을 사용
                const rawTotal = typeof data.total === 'number' ? data.total : 0;
                setTotalCount(Math.min(rawTotal, MAX_TOTAL));
            })
            .catch(err => {
                console.error(err);
                setErrorMessage('데이터 조회 중 오류가 발생했습니다.');
                setBooks([]);
                setTotalCount(0);
            });
    }, [query, page]);

    
     const renderPagination = () => {
        // 실제 페이지 수 계산 후 최대 MAX_PAGES 로 클램핑
        const realPages = Math.ceil(totalCount / size);
        const totalPages = Math.min(realPages, MAX_PAGES);
        if (totalPages <= 1) return null;

        return Array.from({ length: totalPages }, (_, i) => {
            const num = i + 1;
            return (
                <button
                    key={num}
                    className={`${styles.pageButton} ${page === num ? styles.activePage : ''}`}
                    onClick={() => {
                        navigate(`/search/book?query=${encodeURIComponent(query)}&page=${num}`);
                    }}
                >
                    {num}
                </button>
            );
        });
    };
    // 검색 버튼 클릭
    const onSearch = () => {
        if (!input.trim()) {
            setErrorMessage('검색어를 입력해주세요.');
            return;
        }
        // URL 바꿔서 useEffect → fetch 트리거
        navigate(`/search/book?query=${encodeURIComponent(input)}&page=1`);
    };

    return (<>

            <SearchBox />

            {errorMessage && (<div className={styles.noResults} style={{color: 'red', margin: '1rem 0'}}>
                    {errorMessage}
                </div>)}

            <div className={styles.container}>
                <div className={styles.SearchListTitle}>
                    {query ? `# ${query} 검색 결과` : '# 도서 전체 목록'}
                </div>
                <hr className={styles.SearchbookListHr}/>

                <div className={styles.SearchBookList}>
                    {books.length > 0 ? (books.map((b, idx) => (<Fragment key={b.bookIsbn ?? idx}>
                                <div className={styles.bookItem} onClick={() => navigate(`/bookPage/${b.bookIsbn}`)}>
                                    <img
                                        className={styles.book}
                                        src={b.bookCover?.replace('coversum', 'cover500') ?? '/default-cover.png'}
                                        alt={`${b.bookTitle} 표지`}
                                    />
                                    <div className={styles.bookInfo}>
                                        <div className={styles.bookTitle}>{b.bookTitle}</div>
                                        <div className={styles.credits}>
                                            <div className={styles.bookAuthor}>
                                                <span className={styles.label}>저자</span> {b.bookAuthor}
                                            </div>
                                            <div className={styles.bookPublisher}>
                                                <span className={styles.label}>출판사</span> {b.bookPublisher}
                                            </div>
                                        </div>
                                        <p className={styles.bookDetail}>{b.bookDescription}</p>
                                    </div>
                                </div>
                                <hr className={styles.bookListHr}/>
                            </Fragment>))) : (!errorMessage && (<div className={styles.noResults}>
                                {query ? '검색 결과가 없습니다.' : '검색어를 입력하여 도서를 찾아보세요.'}
                            </div>))}
                </div>

                <div className={styles.paginationContainer}>{renderPagination()}</div>
            </div>
        </>);
}

export default SearchBookList;
