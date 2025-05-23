import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import search from '../../assets/search.png';
import UserMainCSS from '../user/UserMain.module.css';
import { testBooks } from './../../apis/BookAPI';
import styles from './SearchBookList.module.css';

function SearchBookList() {

     const navigate = useNavigate();
     const location = useLocation();

     const [bookList, setBookList] = useState([]);
     const [searchVideo, setSearchVideo] = useState('');

     const queryParams = new URLSearchParams(location.search);
     const query = queryParams.get('query');

     // useEffect(() => {
     //      const data = testBooks();  // 동기 호출
     //      console.log("로컬 테스트 JSON 결과:", data);

     //      if (data && data.item) {
     //           setBookList(data.item);  // 바로 상태에 반영
     //      }
     // }, []);

     // useEffect(() => {
     //      if(query) {
     //           console.log('도서 검색어 : ', query);
     //      }
     // }, [query]);

     useEffect(() => {
          const data = testBooks(); // 동기 호출
          if (data && data.item) {
               if (query) {
                    const filteredBooks = data.item.filter(book =>
                         book.title.toLowerCase().includes(query.toLowerCase())
                    );
                    setBookList(filteredBooks);  // 🔍 검색 결과 반영
               } else {
                    setBookList(data.item); // 🔄 기본 전체 목록
               }
          }
     }, [query]); // ✅ query 변경될 때마다 실행




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
                              
                        </div>
                        <hr className={styles.SearchbookListHr} />


                        <div className={styles.SearchBookList}>



                                   <div className={styles.bookList}>
                                        {bookList.map(book => (
                                        <>
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
                                             </div>
                                                  <hr className={styles.bookListHr} />
                                        </>
                                        ))}
                                   </div>
     
                        </div>
                   </div>
              </>
         )
}

export default SearchBookList;