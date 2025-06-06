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

    const [searchInput, setSearchInput] = useState('');

    const [bgImage, setBgImage] = useState(null);

    useEffect(() => {
            const images = [bgimg1, bgimg2, bgimg3, bgimg4];
            const randomImage = images[Math.floor(Math.random() * images.length)];
            setBgImage(randomImage);
        }, []);

    // 검색 실행 함수
    const onSearch = () => {
        const q = searchInput.trim();
        if (!q) return; // 입력이 없으면 아무 동작도 하지 않음
        navigate(`/search/video?query=${encodeURIComponent(q)}&page=1`);
    };

    // Enter 키 눌렀을 때도 검색 실행
    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
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
                            <div className={UserMainCSS.buttonBox}>
                                <button className={UserMainCSS.mainKeywordButton} onClick={onSearch}>#키워드</button>
                                <button className={UserMainCSS.mainKeywordButton} onClick={onSearch}>#키워드</button>
                                <button className={UserMainCSS.mainKeywordButton} onClick={onSearch}>#키워드</button>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default SearchBox;