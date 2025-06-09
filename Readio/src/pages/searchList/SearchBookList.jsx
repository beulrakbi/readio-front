import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { callBookInsertAPI, callBooksAPI } from '../../apis/BookAPICalls';
import styles from './SearchBookList.module.css';
import SearchBox from './SearchBox.jsx';

export default function SearchBookList() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const PAGE_SIZE  = 10; // 한 페이지당 표시 개수
  const FETCH_SIZE = 50; // 검색 시 실제로 채워올 총 개수
  const MAX_PAGES  = 5;  // 페이지 버튼 최대 개수

  // URL 쿼리 파싱: query, page 초기화
  useEffect(() => {
            const qp = new URLSearchParams(location.search);
            const q  = qp.get('query') || '';
            const p  = parseInt(qp.get('page'), 10) || 1;
            setInput(q);
            setQuery(q);
            setPage(p);
      }, [location.search]);

  // 검색어(query)가 바뀔 때마다 DB 조회 → 부족분 API 채우기
  useEffect(() => {
            if (!query) {
                setBooks([]);
                setTotalCount(0);
                return;
            }

    setErrorMessage('');

    // DB에서 최대 FETCH_SIZE 개 가져오기
    fetch(`http://localhost:8080/search/book?query=${encodeURIComponent(query)}&page=1&size=${FETCH_SIZE}`)
      .then(res => res.json())
      .then(json => {
        const { data } = json;
        if (!data || !Array.isArray(data.books)) {
          setErrorMessage('서버 응답이 올바르지 않습니다.');
          setBooks([]);
          setTotalCount(0);
          return;
        }

        const dbBooks = data.books;
        setBooks(dbBooks);
        setTotalCount(dbBooks.length);

        // 부족분이 있으면 API로 채우기
        const needed = FETCH_SIZE - dbBooks.length;
        if (needed > 0) {
          dispatch(callBooksAPI({ search: query, page: 1, size: needed }))
            .then(apiResult => {
              if (!apiResult || !Array.isArray(apiResult.item)) {
                console.error('알라딘 API 응답이 배열이 아닙니다:', apiResult);
                return;
              }

              const mappedApiBooks = apiResult.item.map(it => ({
                bookIsbn:        it.isbn,
                bookTitle:       it.title,
                bookAuthor:      it.author,
                bookPublisher:   it.publisher,
                bookCover:       it.cover,
                bookDescription: it.description,
              }));

              // 저장 요청
              mappedApiBooks.forEach(async book => {
                try {
                  await dispatch(callBookInsertAPI({ form: book }));
                } catch (e) {
                  console.error('DB 저장 실패:', e);
                }
              });

              // 화면에 이어붙이기
              setBooks(prev => [...prev, ...mappedApiBooks]);
              setTotalCount(prev => prev + mappedApiBooks.length);
            });
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('데이터 조회 중 오류가 발생했습니다.');
        setBooks([]);
        setTotalCount(0);
      });
  }, [query, dispatch]);

  const currentPageItems = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 페이지네이션
  const renderPagination = () => {
    const realPages  = Math.ceil(totalCount / PAGE_SIZE);
    const totalPages = Math.min(realPages, MAX_PAGES);
    if (totalPages <= 1) return null;

    return (
      <div className={styles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, i) => {
          const num = i + 1;
          return (
            <button
              key={num}
              className={`${styles.pageButton} ${page === num ? styles.activePage : ''}`}
              onClick={() => navigate(`/search/book?query=${encodeURIComponent(query)}&page=${num}`)}
            >
              {num}
            </button>
          );
        })}
      </div>
    );
  };

  // 검색 버튼 클릭
  const onSearch = () => {
    if (!input.trim()) {
      setErrorMessage('검색어를 입력해주세요.');
      return;
    }
    navigate(`/search/book?query=${encodeURIComponent(input)}&page=1`);
  };

  return (
    <>
      <SearchBox onSearch={onSearch} input={input} setInput={setInput} />

      {errorMessage && (
        <div className={styles.noResults} style={{ color: 'red', margin: '1rem 0' }}>
          {errorMessage}
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.SearchListTitle}>
          {query ? `# ${query} 검색 결과` : '# 도서 전체 목록'}
        </div>
        <hr className={styles.SearchbookListHr} />

        <div className={styles.SearchBookList}>
          {currentPageItems.length > 0 ? (
            currentPageItems.map((b, idx) => (
              <Fragment key={b.bookIsbn ?? idx}>
                <div
                  className={styles.bookItem}
                  onClick={() => navigate(`/bookPage/${b.bookIsbn}`)}
                >
                  <img
                    className={styles.book}
                    src={b.bookCover?.replace('coversum', 'cover500') || '/default-cover.png'}
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
                <hr className={styles.bookListHr} />
              </Fragment>
            ))
          ) : (
            !errorMessage && (
              <div className={styles.noResults}>
                {query ? '검색 결과가 없습니다.' : '검색어를 입력하여 도서를 찾아보세요.'}
              </div>
            )
          )}
        </div>

        {renderPagination()}
      </div>
    </>
  );
}