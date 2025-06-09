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

    const [weatherData, setWeatherData] = useState(null);

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

    // 위치 권한 요청
    useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
            const { latitude: lat, longitude: lon } = coords;
            // 현재 날씨 조회 (무료 엔드포인트)
            const curRes = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` +
                `&units=metric&lang=kr&appid=${OPENWEATHER_KEY}`
            );

            if (!curRes.ok) throw new Error(curRes.statusText);
            const curData = await curRes.json();
            // 5일 예보 조회 (3시간 단위)
            const fcRes = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}` +
                `&units=metric&lang=kr&appid=${OPENWEATHER_KEY}`
            );
            if (!fcRes.ok) throw new Error(fcRes.statusText);
            const fcData = await fcRes.json();
            // 매일 정오 예보만 추출
            const daily = fcData.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .map(item => ({ dt: item.dt, temp: item.main.temp, main: item.weather[0].main }));
            setWeatherData({ current: { temp: curData.main.temp, main: curData.weather[0].main }, daily });
      } catch (err) {
            console.error("날씨 API 호출 실패:", err);
      }
    }, err => console.warn("위치 권한 오류:", err));
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
                {/* 날씨 정보 섹션 */}
                <div className={UserNavCSS.weatherSection}>
                    {weatherData ? (
                        <>
                                <div className={UserNavCSS.today}>
                                    <p>오늘</p>
                                    <span>{Math.round(weatherData.current.temp)}°C</span>
                                    <span>{mapWeatherToEmoji(weatherData.current.main)}</span>
                                </div>
                                <div className={UserNavCSS.forecastContainer}>
                                    {weatherData.daily.slice(0, 5).map((day, idx) => (
                                        <div key={idx} className={UserNavCSS.forecast}>
                                            <p>{new Date(day.dt * 1000).toLocaleDateString("ko-KR", { weekday: "short" })}</p>
                                            <span>{Math.round(day.temp)}°C</span>
                                            <span>{mapWeatherToEmoji(day.main)}</span>
                                        </div>
                                    ))}
                                </div>
                        </>
                    ) : (
                        <p>날씨 정보 불러오는 중…</p>
                    )}
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