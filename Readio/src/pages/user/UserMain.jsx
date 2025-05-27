import search from '../../assets/search.png';
import VideoList from '../../components/video/VideoList.jsx';
import UserMainCSS from './UserMain.module.css';
import {useEffect, useState} from "react";

function UserMain()
{

    const [types, setTypes] = useState([]);
    const allTypes = ["celeb", "goods", "habit"];

    const getRandomTypes = () => {
        const shuffled = [...allTypes].sort(() => 0.5 - Math.random()); // 랜덤 셔플
        setTypes(shuffled);
    };

    useEffect(() => {
        getRandomTypes();
    }, []);

    return (
        <>
            <div className={UserMainCSS.main}>
                <div className={UserMainCSS.mainImgBox}>
                    <div className={UserMainCSS.mainSearch}>
                        <div className={UserMainCSS.buttonBox}>
                            <input className={UserMainCSS.mainSearchInput} type="text" name="search" placeholder="검색어를 입력하세요"/>
                            <button className={UserMainCSS.buttonNone}><img src={search}/></button>
                        </div>
                        <div className={UserMainCSS.buttonBox}>
                            <button className={UserMainCSS.mainKeywordButton}>#키워드</button>
                            <button className={UserMainCSS.mainKeywordButton}>#키워드</button>
                            <button className={UserMainCSS.mainKeywordButton}>#키워드</button>
                        </div>
                    </div>
                </div>
                <p className={UserMainCSS.readio}>READIO</p>
            <div className={UserMainCSS.backgroundTexture}>
                <div className={UserMainCSS.mainTextBox}>
                <p className={UserMainCSS.mainText}>" readio는 책과 영상을 통해 마음을 연결하는 공간입니다.
                    계절처럼 변하는 하루하루, 
                당신에게 꼭 맞는 이야기를 전합니다. "</p>
                </div>
                <div className={UserMainCSS.videoSection}>

                <VideoList type={types[0]}/>
                <VideoList type={types[1]}/>
                <VideoList type={types[2]}/>

                </div>
            </div>
            </div>
        </>
    )
}

export default UserMain;