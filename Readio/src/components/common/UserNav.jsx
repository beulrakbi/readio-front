import { NavLink } from "react-router-dom";
import UserNavCSS from './navi.module.css';


function UserNav({isOpen})
{
    // if (!isOpen) return null;

    return (
        <>
            <div className={`${UserNavCSS.navi} ${isOpen ? UserNavCSS.open : ''}`}>
                <div className={UserNavCSS.naviContainer}>
                    <div className={UserNavCSS.naviLogo}>
                        <p className={UserNavCSS.naviLogoFont}>Readio</p>
                        <div className={UserNavCSS.naviLine}></div>
                    </div>
                    <div className={UserNavCSS.naviLink}>
                        <NavLink to="/" className={UserNavCSS.naviLinkText}>내 정보 수정</NavLink>
                        <NavLink to="/" className={UserNavCSS.naviLinkText}>내 서재</NavLink>
                        <NavLink to="/" className={UserNavCSS.naviLinkText}>피드</NavLink>
                        <NavLink to="/" className={UserNavCSS.naviLinkText}>소식</NavLink>
                        <ul style={{fontSize:'20px', paddingInlineStart:'0px'}}>고객센터
                            <li className={UserNavCSS.naviLinkText}><NavLink to="/" className={UserNavCSS.naviLinkText}>공지사항</NavLink></li>
                            <li className={UserNavCSS.naviLinkText}><NavLink to="/" className={UserNavCSS.naviLinkText} >FAQ</NavLink></li>
                            <li className={UserNavCSS.naviLinkText}><NavLink to="/" className={UserNavCSS.naviLinkText}>Q&A</NavLink></li>
                        </ul>
                    </div>
                    <div className={UserNavCSS.naviBannerContainer}>
                        <p className={UserNavCSS.naviBannerText}>오늘의 소식</p>
                        <NavLink to="/">
                            <div className={UserNavCSS.naviBanner}>
                                <img src/>
                            </div>
                        </NavLink>
                        <div className={UserNavCSS.naviButtonBox}>
                            <input type="radio" name="notice" defaultChecked className={UserNavCSS.naviButton1}/>
                            <input type="radio" name="notice" className={UserNavCSS.naviButton1}/>
                            <input type="radio" name="notice" className={UserNavCSS.naviButton1}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserNav;