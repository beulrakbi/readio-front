import { useState } from 'react';
import styles from './Search.module.css';

function Search({ onSearch }) {
    const [searchInput, setSearchInput] = useState('');

    const handleSearchClick = () => {
        onSearch(searchInput);
    };

    // 엔터키 입력 처리
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 폼 제출 방지
            onSearch(searchInput);
        }
    };

    return (
        <div className={styles.textcontainer}>
            <input
                type="text"
                className={styles.textbox}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown} // 이 부분 추가!
                placeholder="검색어를 입력하세요"
            />
            <button className={styles.btn} onClick={handleSearchClick}>검색</button>
        </div>
    );
}

export default Search;
