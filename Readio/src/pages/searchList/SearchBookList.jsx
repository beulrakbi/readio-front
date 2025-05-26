import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBooksByKeyword } from '../../apis/BookAPI';
import search from '../../assets/search.png';
import UserMainCSS from '../user/UserMain.module.css';
import styles from './SearchBookList.module.css';

function SearchBookList() {

     const navigate = useNavigate();
     const location = useLocation();
     const dispatch = useDispatch();

     const [bookList, setBookList] = useState([]);
     const [searchVideo, setSearchVideo] = useState('');

     const [page, setPage] = useState(1); // 현재 페이지
     const [totalCount, setTotalCount] = useState(0); // 전체 검색 결과 수 

     const queryParams = new URLSearchParams(location.search);
     const query = queryParams.get('query');

    // 알라딘 API 실시간 호출
    useEffect(() => {
        const fetchBooks = async () => {
            if (query) {
                const result = await getBooksByKeyword(query, dispatch, apge);
                if (result && result.item) {
                    setBookList(result.item);
                } else {
                    setBookList([]); // 검색 결과 없을 경우
                }
            }
        };

        fetchBooks();
    }, [query, dispatch]);



     // 검색하면 영상 검색 결과 리스트 뜨게 코드 작성....
     const onSearchChangeHandler = (e) => {
          setSearchVideo(e.target.value);
     }

     const onEnterkeyHandler = (e) => {
          if (e.key == 'Enter') {
               console.log('Enter key', searchVideo);

               navigate(`/search/video?query=${encodeURIComponent(searchVideo)}`);
          }
     };

     const onSearchClickHandler = () => {
          navigate(`/search/video?query=${encodeURIComponent(searchVideo)}`);
     }

     

    return (
              <>
                    <div className={UserMainCSS.mainImgBox}>
                                   <div className={UserMainCSS.mainSearch}>
                                        <div className={UserMainCSS.buttonBox}>
                                             <input className={UserMainCSS.mainSearchInput} 
                                                       type="text" 
                                                       name="search" 
                                                       value={searchVideo}
                                                       onChange={onSearchChangeHandler}
                                                       onKeyDown={onEnterkeyHandler}
                                                       placeholder="검색어를 입력하세요"/>
                                             <button className={UserMainCSS.buttonNone} onClick={onSearchClickHandler}><img src={search}/></button>
                                        </div>
                                        <div className={UserMainCSS.buttonBox}>
                                           <button className={UserMainCSS.mainKeywordButton} onClick={onSearchClickHandler}>#키워드</button>
                                           <button className={UserMainCSS.mainKeywordButton} onClick={onSearchClickHandler}>#키워드</button>
                                           <button className={UserMainCSS.mainKeywordButton} onClick={onSearchClickHandler}>#키워드</button>
                                        </div>
                                   </div>
                    </div>


                   <div className={styles.container}>

                        {/* <div className={styles.SearchListTitle}># 키워드에 대한 검색 결과</div> */}
                        <div className={styles.SearchListTitle}>
                              {query ? `# ${query}에 대한 검색 결과` : '# 도서 전체 목록'}
                        </div>
                        <hr className={styles.SearchbookListHr} />


                        <div className={styles.SearchBookList}>
                         <div className={styles.bookList}>
                         {bookList.length > 0 ? (
                              bookList.map((book) => (
                                   <div key={book.itemId} className={styles.bookItem}>
                                        <div className={styles.book}>
                                             <img
                                             src={book.cover.replace("coversum", "cover500")}
                                             alt={`${book.title} 표지`}
                                             />
                                        </div>
                                        <div className={styles.bookInfo}>
                                             <div className={styles.bookTitle}>{book.title}</div>
                                             <div className={styles.credits}>
                                             <div className={styles.bookAuthor}>{book.author}</div>
                                             <div className={styles.bookPublisher}>{book.publisher}</div>
                                             </div>
                                             <div className={styles.bookDetail}>{book.description}</div>
                                        </div>
                                        <hr className={styles.bookListHr} />
                                   </div>
                              ))
                         ) : (
                              <div className={styles.noResults}>검색 결과가 없습니다.</div>
                         )}
                         </div>
                    </div>
               </div>
          </>
     );
     }

export default SearchBookList;