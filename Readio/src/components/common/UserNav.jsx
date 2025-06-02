import { useSelector } from "react-redux";
import { NavLink , useNavigate} from "react-router-dom";
import UserNavCSS from './navi.module.css';


function UserNav({ isOpen }) {

    const isLogin = useSelector(state => state.user.isLogin);
    console.log('로그인상태', useSelector(state => state));

    const navigate = useNavigate();
    const handleLibraryClick = () => {
        if (isLogin) {
            navigate('/mylibrary');
        } else {
            navigate('/guestlibrary');
        }
    };

    return (
        <>
            <div className={`${UserNavCSS.navi} ${isOpen ? UserNavCSS.open : ''}`}>
                <div className={UserNavCSS.naviContainer}>
                    <div className={UserNavCSS.naviLogo}>
                        <p className={UserNavCSS.naviLogoFont}>Readio</p>
                        <div className={UserNavCSS.naviLine}></div>
                    </div>
                    <div className={UserNavCSS.naviLink}>
                        {isLogin && (   // 추가 (로그인했을때만 해당 메뉴 보여짐)
                            <>
                                <NavLink to="/users/verifypwd" className={UserNavCSS.naviLinkText}>내 정보 수정</NavLink>
                            </>

                        )}
                        <div
                            onClick={handleLibraryClick}
                            className={UserNavCSS.naviLinkText}
                            style={{ cursor: 'pointer' }}
                        >
                            내 서재
                        </div>
                        <NavLink to="/feed" className={UserNavCSS.naviLinkText}>피드</NavLink>
                        <NavLink to="/" className={UserNavCSS.naviLinkText}>소식</NavLink>
                        <ul style={{ fontSize: '20px', paddingInlineStart: '0px' }}>고객센터
                            <li className={UserNavCSS.naviLinkText}><NavLink to="/notice" className={UserNavCSS.naviLinkText}>공지사항</NavLink></li>
                            <li className={UserNavCSS.naviLinkText}><NavLink to="/faq" className={UserNavCSS.naviLinkText} >FAQ</NavLink></li>
                            <li className={UserNavCSS.naviLinkText}><NavLink to="/qna" className={UserNavCSS.naviLinkText}>Q&A</NavLink></li>
                        </ul>
                    </div>
                    <div className={UserNavCSS.naviBannerContainer}>
                        <p className={UserNavCSS.naviBannerText}>오늘의 소식</p>
                        <NavLink to="/">
                            <div className={UserNavCSS.naviBanner}>
                                <img />
                            </div>
                        </NavLink>
                        <div className={UserNavCSS.naviButtonBox}>
                            <input type="radio" name="notice" defaultChecked className={UserNavCSS.naviButton1} />
                            <input type="radio" name="notice" className={UserNavCSS.naviButton1} />
                            <input type="radio" name="notice" className={UserNavCSS.naviButton1} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserNav;