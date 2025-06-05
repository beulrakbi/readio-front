import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import bell from '../../assets/alarm.png';
import logo from '../../assets/Logo.png';
import navBar from '../../assets/NavBar.png';
import searchIcon from '../../assets/search2.png';
import { logout } from '../../modules/user/userSlice';
import HeaderCSS from './Header.module.css';

// Header 컴포넌트가 setIsOpen 프롭을 받도록 수정
function Header({ toggleNav, setIsOpen }) { // setIsOpen 추가
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLogin = useSelector((state) => state.user.isLogin);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('video');
    const [loginModal, setLoginModal] = useState(false);

    const onSearchChangeHandler = (e) => {
        setSearch(e.target.value);
    };

    const onEnterkeyHandler = (e) => {
        if (e.key === 'Enter') {
            if (!search.trim()) return;

            console.log('Enter key', search);
            navigate(`/search/${searchType}?query=${encodeURIComponent(search)}`);
            window.location.reload();
            setIsOpen(false); // 네비바 닫기 추가
        }
    };

    const onSearchClickHandler = () => {
        if (!search.trim()) return;

        navigate(`/search/${searchType}?query=${encodeURIComponent(search)}`);
        window.location.reload();
        setIsOpen(false); // 네비바 닫기 추가
    };

    const onClickLogoHandler = () => {
        navigate('/', { replace: true });
        navigate('/', { replace: true });
        setIsOpen(false); // 네비바 닫기 추가
    };

    const onclickMypageHandler = () => {
        try {
            const token = jwtDecode(window.sessionStorage.getItem('accessToken'));

            if (token.exp * 1000 < Date.now()) {
                setLoginModal(true);
                return;
            }

            navigate('/mylibrary', { replace: true });
            setIsOpen(false); // 네비바 닫기 추가
        } catch (error) {
            console.log("토큰 파싱 실패:", error);
            setLoginModal(true);
        }
    };

    const onClickLogoutHandler = () => {
        dispatch(logout());
        sessionStorage.clear();
        navigate('/', { replace: true });
        setIsOpen(false); // 네비바 닫기 추가
    };

    function BeforeLogin() {
        return (
            <div className={HeaderCSS.headerLogin}>
                <NavLink to="/users/login" className={HeaderCSS.headerLoginBt} onClick={() => setIsOpen(false)}>로그인</NavLink> {/* 네비바 닫기 추가 */}
                &nbsp;
                <NavLink to="/users/join" className={HeaderCSS.headerLoginBt} onClick={() => setIsOpen(false)}>회원가입</NavLink> {/* 네비바 닫기 추가 */}
            </div>
        );
    }

    function AfterLogin() {
        return (
            <div className={HeaderCSS.headerLogin}>
                <button
                    onClick={onclickMypageHandler}
                    className={HeaderCSS.headerLoginBt}>
                    내 서재
                </button>
                <button
                    onClick={onClickLogoutHandler}
                    className={HeaderCSS.headerLoginBt}>
                    로그아웃
                </button>
            </div>
        );
    }

    return (
        <>
            {loginModal ? <loginModal setLoginModal={setLoginModal} /> : null}
            <div className={HeaderCSS.headerDiv}>
                <button type='button' className={HeaderCSS.headerNav} onClick={toggleNav}>
                    <img src={navBar} />
                </button>
                <button
                    onClick={onClickLogoHandler}
                    className={HeaderCSS.headerLogo}
                >
                    <img src={logo} />
                </button>
                <div className={HeaderCSS.rightButtons}>
                    <div className={HeaderCSS.headerSearchDiv}>
                        <select className={HeaderCSS.headerSearchOption}
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value={"video"} style={{ background: 'rgb(77,84,67)' }}>영상</option>
                            <option value={"book"} style={{ background: 'rgb(77,84,67)' }}>도서</option>
                        </select>
                        <input
                            type='text'
                            placeholder='검색'
                            value={search}
                            onKeyUp={onEnterkeyHandler}
                            onChange={onSearchChangeHandler}
                            className={HeaderCSS.headerSearch}
                        />
                        <button className={HeaderCSS.buttonNone}
                            onClick={onSearchClickHandler}
                        ><img src={searchIcon} /></button>
                    </div>
                    <button className={HeaderCSS.headerAlarm}>
                        {/* <img src={bell} /> */}
                    </button>
                    {isLogin ? (<AfterLogin />) : (<BeforeLogin />)}

                </div>
            </div>
        </>
    )
}

export default Header;