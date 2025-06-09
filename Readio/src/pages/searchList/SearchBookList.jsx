import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { callBookInsertAPI, callBooksAPI } from '../../apis/BookAPICalls'; // callBookInsertAPI 추가
import styles from './SearchBookList.module.css';
import SearchBox from './SearchBox.jsx';

function SearchBookList() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // Redux dispatch

  // 1) 로컬 상태
  const [input, setInput] = useState('');          // 검색창 입력값
  const [query, setQuery] = useState('');          // 실제 검색 키워드
  const [page, setPage] = useState(1);             // 페이지 번호
  const [books, setBooks] = useState([]);          // 최종 보여줄 도서 목록 (DB + API 보충)
  const [totalCount, setTotalCount] = useState(0); // DB에서 내려준 total
  const [errorMessage, setErrorMessage] = useState('');
  const size = 10;                                 // 한 페이지당 개수
  const MAX_TOTAL = 100;                           // 최대 결과 수
  const MAX_PAGES = 10;                            // 페이지 버튼 최대 개수

  // 2) URL 쿼리 파싱: query, page 초기화
  useEffect(() => {
    const qp = new URLSearchParams(location.search);
    const q = qp.get('query') || '';
    const p = parseInt(qp.get('page'), 10) || 1;
    setInput(q);
    setQuery(q);
    setPage(p);
  }, [location.search]);

  // 3) DB 조회 후, 부족하면 알라딘 API 호출 보충
  useEffect(() => {
    // query가 빈 문자열이면 결과 초기화
    if (!query) {
      setBooks([]);
      setTotalCount(0);
      return;
    }

    setErrorMessage('');

    // 1) 백엔드(DB) 조회: /search/book?query=...&page=...&size=...
    fetch(`http://localhost:8080/search/book?query=${encodeURIComponent(query)}&page=${page}&size=${size}`)
      .then(res => res.json())
      .then(json => {
        // ResponseDTO 구조: { status, message, data: { books: [...], total: X } }
        const { data } = json;
        if (!data || !Array.isArray(data.books)) {
          setErrorMessage('서버 응답이 올바르지 않습니다.');
          setBooks([]);
          setTotalCount(0);
          return;
        }

        const dbBooks = data.books;     // DB에서 가져온 책 목록
        const dbTotal = data.total;     // DB에서 매칭된 총 개수

        // 1-1) DB 결과를 일단 화면에 세팅
        setBooks(dbBooks);
        setTotalCount(Math.min(dbTotal, MAX_TOTAL));

        // 1-2) “DB에서 반환된 개수가 size보다 작거나, 빈 배열인 경우” → 알라딘 API 호출 보충
        if (dbBooks.length < size) {
          const needed = size - dbBooks.length;

          dispatch(callBooksAPI({ search: query, page: 1, size: needed }))
            .then(apiResult => {
              if (!apiResult || !Array.isArray(apiResult.item)) {
                console.error('알라딘 API 응답이 배열이 아닙니다:', apiResult);
                return;
              }

              // “apiResult.item” → 프론트에서 보여줄 객체 배열(원시 형태)
              const mappedApiBooks = apiResult.item.map(it => ({
                bookIsbn: it.isbn,
                bookTitle: it.title,
                bookAuthor: it.author,
                bookPublisher: it.publisher,
                bookCover: it.cover,
                bookDescription: it.description,
              }));

              // 1-3) DB에 저장: mappedApiBooks를 순회하며 callBookInsertAPI 호출
              mappedApiBooks.forEach(async book => {
                try {
                  await dispatch(callBookInsertAPI({ form: book }));
                } catch (e) {
                  console.error('DB 저장 실패:', e);
                }
              });

              // 1-4) 화면에는 “DB에서 온 책” + “API 보충용 책”을 이어붙여서 표시
              setBooks(prev => [...prev, ...mappedApiBooks]);
              setTotalCount(dbTotal + mappedApiBooks.length);
            });
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('데이터 조회 중 오류가 발생했습니다.');
        setBooks([]);
        setTotalCount(0);
      });
  }, [query, page, dispatch]);

  // 4) 페이지 버튼 렌더링
  const renderPagination = () => {
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

  // 5) 검색 버튼 클릭
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
          {books.length > 0 ? (
            books.map((b, idx) => (
              <Fragment key={b.bookIsbn ?? idx}>
                <div
                  className={styles.bookItem}
                  onClick={() => navigate(`/bookPage/${b.bookIsbn}`)}
                >
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

        <div className={styles.paginationContainer}>{renderPagination()}</div>
      </div>
    </>
  );
}

export default SearchBookList;
