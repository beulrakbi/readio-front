import { useNavigate } from 'react-router-dom';
import search from '../../assets/search.png';
import UserMainCSS from '../user/UserMain.module.css';
import styles from './SearchBookList.module.css';

function SearchBookList() {

     const navigate = useNavigate();
     
     // const [searchVideo, setSearchVideo] = useState('');

     // 책 상세 페이지로 이동하게 하기 
     // const onClickVideoPage = () => {
     //      navigate(`/video`);
     // }


     // 검색하면 영상 검색 결과 리스트 뜨게 코드 작성....
     // const onSearchChangeHandler = (e) => {
     //      setSearchVideo(e.target.value);
     // }

     // const onEnterkeyHandler = (e) => {
     //      if (e.key == 'Enter') {
     //           console.log('Enter key', searchVideo);

     //           navigate(`/search/video`);
     //      }
     // };

     const onSearchClickHandler = () => {
          navigate(`/search/video`);
     }

     

    return (
              <>
                    <div className={UserMainCSS.mainImgBox}>
                                   <div className={UserMainCSS.mainSearch}>
                                        <div className={UserMainCSS.buttonBox}>
                                             <input className={UserMainCSS.mainSearchInput} type="text" name="search" placeholder="검색어를 입력하세요"/>
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

                        <div className={styles.SearchListTitle}># 키워드에 대한 검색 결과</div>
                        <hr />
                        <div className={styles.SearchBookList}>
    
                             <div className={styles.bookList}>
                                  <div className={styles.book}></div>
                                  <div className={styles.bookInfo}>
                                       <div className={styles.bookTitle}>그리고 바통은 넘겨졌다.</div>
                                       <div className={styles.credits}>
                                            <div className={styles.bookAuthor}>세오 마이코</div> {/* 저자 */}
                                            <div className={styles.bookPublisher}>스토리텔러</div> {/* 출판사 */}
                                       </div>
                                       <div className={styles.bookDetail}>“부모 역할에 대해 생각해 보게 하는 소설”이 소설의 재미는 
                                                                            기둥 줄거리를 이끌어 가는 37세 아버지와 17세 딸이 각각 아버지 역할과
                                                                            딸 역할에 최선을 다하면서 만들어내는 미묘한 분위기에 있다....   
                                                                        </div>
                                  </div>
                             </div>
                             <hr />


                             <div className={styles.bookList}>
                                  <div className={styles.book}></div>
                                  <div className={styles.bookInfo}>
                                       <div className={styles.bookTitle}>그리고 바통은 넘겨졌다.</div>
                                       <div className={styles.credits}>
                                            <div className={styles.bookAuthor}>세오 마이코</div> {/* 저자 */}
                                            <div className={styles.bookPublisher}>스토리텔러</div> {/* 출판사 */}
                                       </div>
                                       <div className={styles.bookDetail}>“부모 역할에 대해 생각해 보게 하는 소설”이 소설의 재미는 
                                                                            기둥 줄거리를 이끌어 가는 37세 아버지와 17세 딸이 각각 아버지 역할과
                                                                            딸 역할에 최선을 다하면서 만들어내는 미묘한 분위기에 있다....   
                                                                        </div>
                                  </div>
                             </div>
                             <hr />


                             <div className={styles.bookList}>
                                  <div className={styles.book}></div>
                                  <div className={styles.bookInfo}>
                                       <div className={styles.bookTitle}>그리고 바통은 넘겨졌다.</div>
                                       <div className={styles.credits}>
                                            <div className={styles.bookAuthor}>세오 마이코</div>
                                            <div className={styles.bookPublisher}>스토리텔러</div>
                                       </div>
                                       <div className={styles.bookDetail}>“부모 역할에 대해 생각해 보게 하는 소설”이 소설의 재미는 
                                                                            기둥 줄거리를 이끌어 가는 37세 아버지와 17세 딸이 각각 아버지 역할과
                                                                            딸 역할에 최선을 다하면서 만들어내는 미묘한 분위기에 있다....   
                                                                        </div>
                                  </div>
                             </div>
    
     
                        </div>
                        <hr />
                   </div>
              </>
         )
}

export default SearchBookList;