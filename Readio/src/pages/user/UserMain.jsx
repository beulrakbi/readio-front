import bgimg from '../../assets/bgimg.png';
import UserMainCSS from './UserMain.module.css';

function UserMain()
{
    return (
        <>
            <div className={UserMainCSS.main}>
                <div className={UserMainCSS.mainImgBox}>
                    <img className={UserMainCSS.mainImg} src={bgimg} alt={"배경"}/>
                </div>
            </div>
            <div className={UserMainCSS.backgroundTexture}>
                test
            </div>
            
        </>
    )
}

export default UserMain;