import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import UserNavCSS from './navi.module.css';


function UserNav({ isOpen, setIsOpen }) {

    const isLogin = useSelector(state => state.user.isLogin);

    // 삭제 예정
    // const navigate = useNavigate();

    // const handleLibraryClick = () => {
    //     if (isLogin) {
    //         navigate('/mylibrary');
    //     } else {
    //         navigate('/guestlibrary');
    //     }
    //     setIsOpen(false);
    // };

    return (
        <div className={`${UserNavCSS.navi} ${isOpen ? UserNavCSS.open : ''}`}>
            <div className={UserNavCSS.naviContainer}>
                <div className={UserNavCSS.naviLogo}>
                    <p className={UserNavCSS.naviLogoFont}>Readio</p>
                    <div className={UserNavCSS.naviLine}></div>
                </div>
                <div className={UserNavCSS.naviLink}>
                    {isLogin && (
                        <NavLink to="/users/verifypwd"
                            className={UserNavCSS.naviLinkText}
                            onClick={() => setIsOpen(false)}
                        >내 정보 수정</NavLink>
                    )}

                    <NavLink
                        to={isLogin ? "/mylibrary" : "/guestlibrary"}
                        className={UserNavCSS.naviLinkText}
                        onClick={() => setIsOpen(false)}
                    >
                        내 서재
                    </NavLink>

                    {/* <div 삭제 예정
                        onClick={handleLibraryClick}
                        className={UserNavCSS.naviLinkText}
                        style={{ cursor: 'pointer' }}
                    >
                        내 서재

                    </div> */}

                    <NavLink
                        to="/feed"
                        className={UserNavCSS.naviLinkText}
                        onClick={() => setIsOpen(false)}
                    >
                        피드
                    </NavLink>

                    <NavLink
                        to="/"
                        className={UserNavCSS.naviLinkText}
                        onClick={() => setIsOpen(false)}
                    >
                        소식
                    </NavLink>

                    <ul style={{ fontSize: '20px', paddingInlineStart: '0px' }}>
                        고객센터
                        <li className={UserNavCSS.naviLinkText}>
                            <NavLink to="/notice" className={UserNavCSS.naviLinkText}
                                onClick={() => setIsOpen(false)}
                            >공지사항
                            </NavLink></li>
                        <li className={UserNavCSS.naviLinkText}>
                            <NavLink to="/faq" className={UserNavCSS.naviLinkText}
                                onClick={() => setIsOpen(false)}
                            >FAQ
                            </NavLink></li>
                        <li className={UserNavCSS.naviLinkText}>
                            <NavLink to="/qna" className={UserNavCSS.naviLinkText}
                                onClick={() => setIsOpen(false)}
                            >Q&A
                            </NavLink></li>
                    </ul>
                </div>
                <div className={UserNavCSS.naviBannerContainer}>
                    <p className={UserNavCSS.naviBannerText}>오늘의 소식</p>
                    <NavLink to="/" onClick={() => setIsOpen(false)}>
                        <div className={UserNavCSS.naviBanner}>
                            <img alt="오늘의 소식 이미지" />
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
    );
}

export default UserNav;