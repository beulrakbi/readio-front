import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useCallback } from "react"; // useCallback 추가
import UserNavCSS from './navi.module.css';


function UserNav({ isOpen, setIsOpen }) {

    const isLogin = useSelector(state => state.user.isLogin);
    const [customerServiceOpen, setCustomerServiceOpen] = useState(false);

    const toggleCustomerService = () => {
        setCustomerServiceOpen(!customerServiceOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // 오버레이 클릭 시 네비바 닫기 (선택 사항)
    const closeNavOnOverlayClick = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return (
        <>
            {isOpen && <div className={`${UserNavCSS.naviOverlay} ${isOpen ? UserNavCSS.open : ''}`} onClick={closeNavOnOverlayClick}></div>}
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

                        <NavLink
                            to="/feed"
                            className={UserNavCSS.naviLinkText}
                            onClick={() => setIsOpen(false)}
                        >
                            피드
                        </NavLink>

                        <div
                            className={`${UserNavCSS.customerServiceToggle} ${customerServiceOpen ? UserNavCSS.open : ''}`}
                            onClick={toggleCustomerService}
                        >
                            고객센터
                            <span className={UserNavCSS.toggleArrow}>
                                {customerServiceOpen ? '▲' : '▼'}
                            </span>
                        </div>
                        <ul className={`${UserNavCSS.customerServiceList} ${customerServiceOpen ? UserNavCSS.open : ''}`}>
                            <li className={UserNavCSS.naviLinkText}>
                                <NavLink to="/notice" className={UserNavCSS.naviLinkText}
                                    onClick={() => setIsOpen(false)}
                                >공지사항
                                </NavLink>
                            </li>
                            <li className={UserNavCSS.naviLinkText}>
                                <NavLink to="/faq" className={UserNavCSS.naviLinkText}
                                    onClick={() => setIsOpen(false)}
                                >FAQ
                                </NavLink>
                            </li>
                            <li className={UserNavCSS.naviLinkText}>
                                <NavLink to="/qna" className={UserNavCSS.naviLinkText}
                                    onClick={() => setIsOpen(false)}
                                >Q&A
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserNav;