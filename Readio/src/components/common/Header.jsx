import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import bell from '../../assets/alarm.png';
import logo from '../../assets/Logo.png';
import navBar from '../../assets/NavBar.png';
import searchIcon from '../../assets/search2.png';
import HeaderCSS from './Header.module.css';

function Header({toggleNav}) {
    const navigate = useNavigate();

    const dispatch = useDispatch
    // const loginMember = useEslector((state) => state.memberReducer);
    const isLogin = window.localStorage.getItem('accessToken');
    const [search, setSearch] = useState('');

    const [loginModal, setLoginModal] = useState(false);

    // const [navOpen, setNavOpen] = useState(false);

    // const toggleNav = () => {
    //     setNavOpen(!navOpen);
    // }

    const onSearchChangeHandler = (e) => {
        setSearch(e.target.value);
    };

    const onEnterkeyHandler = (e) => {
        if (e.key == 'Enter') {
            console.log('Enter key', search);

            navigate(`/search?value=${search}`, {replace: false});

            window.location.reload();
        }
    };

    const onClickLogoHandler = () => {
        navigate('/', {replace: true});
    };

    const onclickMypageHandler = () => {
        const token = decodeJwt(window.localStorage.getItem('accessToken'));
        
        if (token.exp * 1000 < Date.now()) {
            setLoginModal(true);
            return;
        }

        navigate('/내서재 링크-수정', {replace: true});
    };

    const onClickLogoutHandler = () => {
        window.localStorage.removeItem('accessToken')
        dispatch(callLogoutAPI());

        navigate('/',{replace: true});
        window.location.reload();
    };

    function BeforeLogin() {
        return (
            <div className={HeaderCSS.headerLogin}>
                <NavLink to="/login" className={HeaderCSS.headerLoginBt}>로그인</NavLink>
                &nbsp;
                <NavLink to="/join" className={HeaderCSS.headerLoginBt}>회원가입</NavLink>
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

    return(
        <>
            {loginModal ? <loginModal setLoginModal={setLoginModal}/> : null}
            <div className={HeaderCSS.headerDiv}>
                <button type='button' className={HeaderCSS.headerNav} onClick={toggleNav}>
                    <img src={navBar}/>
                </button>
                <button
                    onClick={onClickLogoHandler}
                    className={HeaderCSS.headerLogo}
                >
                    <img src={logo}/>
                </button>
                <div className={HeaderCSS.rightButtons}>
                <div className={HeaderCSS.headerSearchDiv}>
                    <select className={HeaderCSS.headerSearchOption}>
                        <option value={"video"} style={{background: 'rgb(77,84,67)'}}>영상</option>
                        <option value={"book"} style={{background: 'rgb(77,84,67)'}}>도서</option>
                    </select>
                    <input
                        type='text'
                        placeholder='검색'
                        value={search}
                        onKeyUp={onEnterkeyHandler}
                        onChange={onSearchChangeHandler}
                        className={HeaderCSS.headerSearch}
                    />
                    <button className={HeaderCSS.buttonNone}><img src={searchIcon}/></button>
                </div>
                <button className={HeaderCSS.headerAlarm}>
                    <img src={bell} />
                </button>
                {isLogin == null || isLogin === undefined ? (
                    <BeforeLogin />
                ) : (
                    <AfterLogin />
                )}
                </div>
            </div>
        </>
    )
}

export default Header;