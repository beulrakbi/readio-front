import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import UserNavCSS from './navi.module.css';


const OPENWEATHER_KEY = "52003f931a0d81375dba797857ece5da";

const mapWeatherToEmoji = (weatherMain) => {
    switch (weatherMain) {
            case "Clear":        return "☀️";
            case "Clouds":       return "⛅";
            case "Rain":
            case "Drizzle":      return "🌧️";
            case "Thunderstorm": return "⛈️";
            case "Snow":         return "☃️";
            case "Mist":
            case "Fog":
            case "Haze":         return "🌫️";
            default:             return "❓";
    }
};


function UserNav({ isOpen, setIsOpen }) {

    const isLogin = useSelector(state => state.user.isLogin);
    const [customerServiceOpen, setCustomerServiceOpen] = useState(false);

    const [weatherEmoji, setWeatherEmoji] = useState("");

    const toggleCustomerService = () => {
        setCustomerServiceOpen(!customerServiceOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // 컴포넌트 언마운트 시 원복
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // 2) 위치 권한 요청 → 날씨 API 호출 → 이모티콘 저장
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        try {
                const { latitude: lat, longitude: lon } = coords;
                const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` +
                `&appid=${OPENWEATHER_KEY}&lang=kr`
            );
                if (!res.ok) throw new Error(res.statusText);
                const data = await res.json();
                const main = data.weather?.[0]?.main || "";
                setWeatherEmoji(mapWeatherToEmoji(main));
        } catch (err) {
            console.error("날씨 API 호출 실패:", err);
        }
        }, err => {
            console.warn("위치 권한 오류:", err);
        });
    }, []);

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

                    <NavLink
                        to="/feed"
                        className={UserNavCSS.naviLinkText}
                        onClick={() => setIsOpen(false)}
                    >
                        피드
                    </NavLink>

                    {/* <NavLink
                        to="/"
                        className={UserNavCSS.naviLinkText}
                        onClick={() => setIsOpen(false)}
                    >
                        소식
                    </NavLink> */}

                    {/* 고객센터 토글 섹션: customerServiceOpen 상태에 따라 open 클래스 추가 */}
                    <div
                        className={`${UserNavCSS.customerServiceToggle} ${customerServiceOpen ? UserNavCSS.open : ''}`}
                        onClick={toggleCustomerService}
                    >
                        고객센터
                        <span className={UserNavCSS.toggleArrow}>
                            {customerServiceOpen ? '▲' : '▼'}
                        </span>
                    </div>
                    {/* customerServiceOpen이 true일 때만 렌더링하도록 조건부 렌더링 유지 */}
                    {/* customerServiceList에도 open 클래스 추가 */}
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
                <div className={UserNavCSS.weatherEmoji}>
                    오늘의 날씨 {weatherEmoji}
                </div>
                {/* <div className={UserNavCSS.naviBannerContainer}>
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
                </div> */}
            </div>
        </div>
    );
}

export default UserNav;