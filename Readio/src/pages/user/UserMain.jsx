import search from '../../assets/search.png';
import VideoList from '../../components/video/VideoLIst';
import UserMainCSS from './UserMain.module.css';

function UserMain()
{
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
                    {/* <img className={UserMainCSS.mainImg} src={bgimg} alt={"배경"}/> */}
                </div>
                <p className={UserMainCSS.readio}>READIO</p>
            <div className={UserMainCSS.backgroundTexture}>
                <div className={UserMainCSS.mainTextBox}>
                <p className={UserMainCSS.mainText}>" readio는 책과 영상을 통해 마음을 연결하는 공간입니다.
                    계절처럼 변하는 하루하루, 
                당신에게 꼭 맞는 이야기를 전합니다. "</p>
                </div>
                <div className={UserMainCSS.videoSection}>

                <VideoList />
                <VideoList />
                <VideoList />

                </div>
            </div>
            </div>
        </>
    )
}

export default UserMain;