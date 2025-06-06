import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import bgimg1 from '../../assets/bgimg.png';
import bgimg2 from '../../assets/bgimg2.png';
import bgimg3 from '../../assets/bgimg3.png';
import bgimg4 from '../../assets/bgimg4.png';
import search from '../../assets/search.png';
import UserMainCSS from '../user/UserMain.module.css';


function SearchBox() {

    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId"); 
    const [searchInput, setSearchInput] = useState('');
    const [bgImage, setBgImage] = useState(null);
    const [recentKeywords, setRecentKeywords] = useState([]);

    useEffect(() => {
            const images = [bgimg1, bgimg2, bgimg3, bgimg4];
            const randomImage = images[Math.floor(Math.random() * images.length)];
            setBgImage(randomImage);
        }, []);

    useEffect(() => {
         if (!userId) {
            // 비로그인 상태면 로컬키도 읽지 않고 recentKeywords 빈 상태 유지
            return;
        }
        // 로그인된 userId가 있을 때만 해당 key로 가져옴
        const key = `recentSearches_${userId}`;
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        setRecentKeywords(stored);

        // 컴포넌트 호출 시 localStorage 초기화 => 혹시 몰라 넣어놓은 코드...?
        // localStorage.removeItem('recentSearches');
        // setRecentKeywords([]);
    }, [userId]);


    const saveRecentSearch = (keyword) => {
        if (!keyword || !userId) return;
        const key = `recentSearches_${userId}`; 
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        const filtered = stored.filter(k => k !== keyword);
        const updated = [keyword, ...filtered].slice(0, 3); // 최대 3개
        localStorage.setItem(key, JSON.stringify(updated));
        setRecentKeywords(updated);
    };


    // 검색 실행 함수
    const onSearch = () => {
        const q = searchInput.trim();
        if (!q) return; 
        if (userId) {
            saveRecentSearch(q);
        }
        navigate(`/search/video?query=${encodeURIComponent(q)}`);
    };

    // Enter 키 눌렀을 때도 검색 실행
    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    // 최근 검색어 클릭 시
    const onRecentClick = (keyword) => {
        setSearchInput(keyword);
        if (userId) {
            saveRecentSearch(keyword);
        }
        navigate(`/search/video?query=${encodeURIComponent(keyword)}`);
    };


    return (
        <>
            <div className={UserMainCSS.main}>
                    <div className={UserMainCSS.mainImgBox} style={{ backgroundImage: `url(${bgImage})` }}>
                        <div className={UserMainCSS.mainSearch}>
                            <div className={UserMainCSS.buttonBox}>
                                <input className={UserMainCSS.mainSearchInput} 
                                        type="text" 
                                        name="search"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)} onKeyDown={onKeyDown}
                                        placeholder="검색어를 입력하세요" />
                                <button className={UserMainCSS.buttonNone} onClick={onSearch}><img src={search} /></button>
                            </div>

                            {/* 로그인된 사용자만 recentKeywords 출력 */}
                            {userId && recentKeywords.length > 0 && (
                                <div className={UserMainCSS.buttonBox}>
                                {recentKeywords.map((kw, idx) => (
                                    <button
                                    key={idx}
                                    className={UserMainCSS.mainKeywordButton}
                                    onClick={() => onRecentClick(kw)}
                                    >
                                    {`# ${kw}`}
                                    </button>
                                ))}
                                </div>
                            )}
      
                        </div>
                    </div>
            </div>
        </>
    )
}

export default SearchBox;