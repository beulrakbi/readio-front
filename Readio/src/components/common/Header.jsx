import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import bell from '../../assets/alarm.png';
import logo from '../../assets/Logo.png';
import navBar from '../../assets/NavBar.png';
import searchIcon from '../../assets/search2.png';
import HeaderCSS from './Header.module.css';
import { loginSuccess, logout } from '../../modules/user/userSlice';

function Header({ toggleNav }) {
    const navigate = useNavigate();


    const dispatch = useDispatch();

    // const loginMember = useEslector((state) => state.memberReducer);
    // const isLogin = window.localStorage.getItem('accessToken');
    const isLogin = useSelector((state) => state.user.isLogin);
    const [search, setSearch] = useState('');

    const [searchType, setSearchType] = useState('video'); // 추가 

    const [loginModal, setLoginModal] = useState(false);

    // const [navOpen, setNavOpen] = useState(false);

    // const toggleNav = () => {
    //     setNavOpen(!navOpen);
    // }

    const onSearchChangeHandler = (e) => {
        setSearch(e.target.value);
    };

    const onEnterkeyHandler = (e) => {
        if (e.key === 'Enter') {

            if (!search.trim()) return; // 빈 검색어 방지

            console.log('Enter key', search);

            // navigate(`/search?value=${search}`, {replace: false});
            navigate(`/search/${searchType}`); // 추가 => 선택된 검색 타입에 따라 경로 이동

            // 검색 타입과 검색어를 함께 넘겨야 할때 쓸 코드 작성 

            navigate(`/search/${searchType}?query=${encodeURIComponent(search)}`);

            window.location.reload();
        }
    };

    const onSearchClickHandler = () => { // 함수 추가함
        // navigate(`/search/${searchType}`); // 추가 => 선택된 검색 타입에 따라 경로 이동

        if (!search.trim()) return; // 빈 검색어 방지

        // 검색 타입과 검색어를 함께 넘겨야 할때 쓸 코드 작성 
        navigate(`/search/${searchType}?query=${encodeURIComponent(search)}`);

        window.location.reload(); // 없어도 되는..? 코드...
    }


    const onClickLogoHandler = () => {
        navigate('/', { replace: true });
        navigate('/', { replace: true });
    };

    const onclickMypageHandler = () => {
        try {
            const token = jwtDecode(window.localStorage.getItem('accessToken'));

            if (token.exp * 1000 < Date.now()) {
                setLoginModal(true);
                return;
            }

            navigate('/mylibrary', { replace: true });

        } catch (error) {
            console.log("토큰 파싱 실패:", error);
            setLoginModal(true);
        }
    };

    // 로그아웃 핸들러
    const onClickLogoutHandler = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId'); // 추가
        localStorage.removeItem('userName'); // 추가
        localStorage.removeItem('isPasswordVerified'); // 추가

        dispatch(logout());
        navigate('/', { replace: true });
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const token = jwtDecode(accessToken);
                if (token.exp * 1000 > Date.now()) {
                    // 토큰이 유효할때 로그인 상태 유지
                    dispatch(loginSuccess({ userId: token.sub }));
                } else {
                    console.log('토큰이 만료되었습니다.');
                    localStorage.removeItem('accessToken'); // 추가
                    localStorage.removeItem('userId'); // 추가
                    localStorage.removeItem('userName'); // 추가
                    localStorage.removeItem('isPasswordVerified'); // 추가
                    dispatch(logout());  // 토큰 만료시 로그아웃 처리
                }
            } catch (error) {
                console.error('토큰 파싱 실패:', error);
                localStorage.removeItem('accessToken'); // 추가
                localStorage.removeItem('userId'); // 추가
                localStorage.removeItem('userName'); // 추가
                localStorage.removeItem('isPasswordVerified'); // 추가
                dispatch(logout());  // 토큰 파싱 실패시 로그아웃 처리
            }
        } else {
            console.log('토큰 없음. 로그인 상태가 아닙니다.');
            // 없을테지만 혹시 모를 상황에 대비
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('isPasswordVerified');
            dispatch(logout());  // 토큰 없으면 로그아웃 처리
        }
    }, [dispatch])

    function BeforeLogin() {
        return (
            <div className={HeaderCSS.headerLogin}>
                <NavLink to="/users/login" className={HeaderCSS.headerLoginBt}>로그인</NavLink>
                &nbsp;
                <NavLink to="/users/join" className={HeaderCSS.headerLoginBt}>회원가입</NavLink>
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
                            value={searchType} // 추가
                            onChange={(e) => setSearchType(e.target.value)} // 추가
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
                            onClick={onSearchClickHandler} // 추가 => 클릭 시 검색
                        ><img src={searchIcon} /></button>
                    </div>
                    <button className={HeaderCSS.headerAlarm}>
                        <img src={bell} />
                    </button>
                    {isLogin ? (<AfterLogin />) : (<BeforeLogin />)}

                    {/* {isLogin == null || isLogin === undefined ? (  // 이렇게 하면 에러나요 
                        <BeforeLogin />
                    ) : (
                        <AfterLogin />
                    )} */}

                </div>
            </div>
        </>
    )
}

export default Header;