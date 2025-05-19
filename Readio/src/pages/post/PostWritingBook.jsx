
import { useDispatch, useSelector } from 'react-redux';
import { resetSearch, setQuery, setType } from '../../modules/postwriting/bookSearchSlice'; // Slice 액션 경로
import { searchAladinBooks } from '../../modules/postwriting/bookSearchThunk'; // Thunk 경로

function PostWritingBook({ onBookSelect, onClose, PostCSS }) {
    const dispatch = useDispatch();
    const {
        searchResults,
        isLoading,
        error,
        currentPage,
        isLastPage,
        currentQuery,
        currentSearchType,
        lastSuccessfulQuery, // 더보기 시 사용
        lastSuccessfulSearchType
    } = useSelector((state) => state.bookSearch);

    // UI 입력 필드와 Redux 상태 동기화
    const handleQueryChange = (e) => {
        dispatch(setQuery(e.target.value));
    };

    const handleTypeChange = (e) => {
        dispatch(setType(e.target.value));
        // 타입 변경 시 검색 결과 초기화 및 새 검색 유도 가능
        dispatch(resetSearch());
        if (e.target.value === 'ItemNewAll') { // 신간 전체는 검색어 없이 바로 검색
             dispatch(searchAladinBooks({ query: '', searchType: e.target.value, page: 1, loadMore: false }));
        } else if (currentQuery.trim()) { // 기존 검색어가 있으면 해당 타입으로 재검색
            dispatch(searchAladinBooks({ query: currentQuery, searchType: e.target.value, page: 1, loadMore: false }));
        }
    };

    // 검색 버튼 클릭 또는 Enter 키
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!currentQuery.trim() && currentSearchType !== 'ItemNewAll') {
            alert('검색어를 입력해주세요.');
            return;
        }
        dispatch(resetSearch()); // 새 검색 시작 전 이전 결과 초기화
        dispatch(searchAladinBooks({ query: currentQuery, searchType: currentSearchType, page: 1, loadMore: false }));
    };

    const handleLoadMore = () => {
        if (!isLastPage && !isLoading) {
            // 더보기는 마지막으로 성공한 검색어와 타입으로 다음 페이지 요청
            dispatch(searchAladinBooks({ query: lastSuccessfulQuery, searchType: lastSuccessfulSearchType, page: currentPage + 1, loadMore: true }));
        }
    };

    const handleBookItemClick = (book) => {
        onBookSelect(book); // 부모 컴포넌트로 선택된 책 정보 전달
        if (onClose) onClose(); // 모달 닫기
    };

    return (
        <div className={PostCSS.writingBookDiv}>
            {onClose && <button type="button" className={PostCSS.closeBookSearchBtn} onClick={onClose}>X</button>}
            {/* <h4>책 검색 (알라딘 API)</h4> */}

            <form onSubmit={handleSearchSubmit} style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <select
                    className={PostCSS.writingBook}
                    value={currentSearchType}
                    onChange={handleTypeChange}
                    disabled={isLoading}
                >
                    <option value="Title">도서명으로 검색</option>
                    <option value="Author">저자명으로 검색</option>
                    <option value="Publisher">출판사명으로 검색</option>
                </select>
                <input
                    type="text"
                    placeholder='검색'
                    className={PostCSS.writingSearch}
                    value={currentQuery}
                    onChange={handleQueryChange}
                    disabled={isLoading || currentSearchType === 'ItemNewAll'}
                />
                {/* 검색 버튼을 form 바깥이나 다른 위치에 두고 싶다면 form 태그 없이 별도 버튼으로 처리 */}
                {/* <button type="submit" disabled={isLoading} style={{marginTop: '10px'}}>검색</button> */}
            </form>


            {error && <p style={{ color: 'red', marginTop: '10px', width: '80%', textAlign: 'center' }}>오류: {error}</p>}

            <ul className={PostCSS.searchResultsList} style={{width: '80%', marginTop: '20px'}}>
                {searchResults.length > 0 ? (
                    searchResults.map((book, index) => (
                        <li
                            key={`${book.isbn}-${index}`}
                            className={PostCSS.searchResultItem}
                            onClick={() => handleBookItemClick(book)}
                        >
                            <img src={book.coverUrl} alt={book.title} className={PostCSS.searchResultCover} />
                            <div className={PostCSS.searchResultInfo}>
                                <p className={PostCSS.searchResultTitle} dangerouslySetInnerHTML={{ __html: book.title }}></p>
                                <p className={PostCSS.searchResultAuthor}>{book.author}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    !isLoading && (lastSuccessfulQuery || currentSearchType === 'ItemNewAll') && <p style={{textAlign: 'center', marginTop: '20px'}}>검색 결과가 없습니다.</p>
                )}
                 {/* 초기 상태 또는 검색어 없을 때 메시지 */}
                {!isLoading && !lastSuccessfulQuery && currentSearchType !== 'ItemNewAll' && searchResults.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>검색어를 입력하거나 "신간 전체보기"를 선택하세요.</p>}
            </ul>

            {isLoading && <p style={{marginTop: '10px', width: '80%', textAlign: 'center'}}>검색 중...</p>}
            {!isLoading && searchResults.length > 0 && !isLastPage && (
                <button
                    type="button"
                    onClick={handleLoadMore}
                    className={PostCSS.loadMoreBtn}
                    style={{width: '80%', marginTop: '20px'}}
                    disabled={isLoading}
                >
                    더보기
                </button>
            )}
        </div>
    );
}

export default PostWritingBook;