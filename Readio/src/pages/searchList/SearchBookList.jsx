import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBooksByKeyword } from '../../apis/BookAPI'; // BookAPI에서 호출
import search from '../../assets/search.png';
import UserMainCSS from '../user/UserMain.module.css';
import styles from './SearchBookList.module.css';

function SearchBookList() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState('');              
  const [bookList, setBookList]       = useState([]);             
  const [totalCount, setTotalCount]   = useState(0);                 
  // const [page, setPage] = useState(1);            
  const size = 10;

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const page = parseInt(queryParams.get('page'), 10) || 1; 

  // API 호출
  useEffect(() => {
    if (!query) return;
    setErrorMessage(''); //  이전 에러 초기화
    (async () => {
      try {
        const { item : items, totalResults : total, error } = await getBooksByKeyword(query, dispatch, page, size);
        if (error) {
          setErrorMessage(error);    //  에러 핸들링
          setBookList([]);
          setTotalCount(0);
        } else if (items) {
          setBookList(items || []);
          // setTotalCount(total || 0);
          const MAX_RESULTS = 100; // 전체 결과 수 제한 
          setTotalCount(Math.min(total || 0, MAX_RESULTS));
        }
      } catch (e) {
        console.error(e);
        setErrorMessage('데이터 조회 중 오류가 발생했습니다.');
        setBookList([]);
        setTotalCount(0);
      }
    })();
  }, [location, search]);
  // }, [query, page]);


  // 페이지네이션 렌더링
  const renderPagination = () => {
    // const totalPages = Math.ceil(totalCount / size);
    const totalPages = Math.min(Math.ceil(totalCount / size), 10);
    if (totalPages <= 1) return null; //  한 페이지만 있으면 숨김


    return Array.from({ length: totalPages }, (_, i) => {
    const pageNum = i + 1;
    return (
      <button
        key={pageNum}
        className={`${styles.pageButton} ${page === pageNum ? styles.activePage : ''}`}
        onClick={() => {
          navigate(`/search/book?query=${encodeURIComponent(query)}&page=${pageNum}`);
        }}
      >
        {pageNum}
      </button>
    );
  });


  };

  // 검색 실행
  const onSearch = () => {
    if (!query.trim()) {
      setErrorMessage('검색어를 입력해주세요.');                     //  빈 입력 방지
      return;
    }
    navigate(`/search/book?query=${encodeURIComponent(query)}&page=1`);   // 검색시 page=1로 초기화 위함
    // setPage(1);
  };

  return (
    <>
      <div className={UserMainCSS.mainImgBox}>
        <div className={UserMainCSS.mainSearch}>
          <div className={UserMainCSS.buttonBox}>
            <input
              className={UserMainCSS.mainSearchInput}
              type="text"
              value={query}
              onChange={e => navigate(`/search/book?query=${encodeURIComponent(e.target.value)}`)} // 🚨 URL 동기화
              onKeyDown={e => e.key==='Enter' && onSearch()}
              placeholder="검색어를 입력하세요"
            />
            <button onClick={onSearch}><img src={search} alt="검색"/></button>
          </div>
        </div>
      </div>

      {/*  에러 메시지 표시 */}
      {errorMessage && (
        <div className={styles.noResults} style={{ color: 'red', margin: '1rem 0' }}>
          {errorMessage}
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.SearchListTitle}>
          {query ? `# ${query} 검색 결과` : '# 도서 전체 목록'}
        </div>
        <hr className={styles.SearchbookListHr}/>

        <div className={styles.SearchBookList}>
          {bookList.length > 0 ? (
            bookList.map((book, index) => (

              <Fragment key={book.isbn ?? index}>
              
              <div key={book.isbn ?? index} className={styles.bookItem}>
                <img
                  className={styles.book}
                  src={book.cover?.replace('coversum','cover500')} 
                  alt={`${book.title} 표지`}
                  />
                <div className={styles.bookInfo}>
                  <div className={styles.bookTitle}>{book.title}</div>
                  <div className={styles.credits}>
                    <span className={styles.bookAuthor}>{book.author}</span>
                    <span className={styles.bookPublisher}>{book.publisher}</span>
                  </div>
                  <p className={styles.bookDetail}>{book.description}</p>
                </div>
              </div>
                <hr className={styles.bookListHr}/>
                  
              </Fragment>
            ))
          ) : (
            !errorMessage && (
              <div className={styles.noResults}>
                {query ? "검색 결과가 없습니다." : "검색어를 입력하여 도서를 찾아보세요."}
              </div>
            )
          )}
        </div>

        <div className={styles.paginationContainer}>
          {renderPagination()}
        </div>
      </div>
    </>
  );
}

export default SearchBookList;
