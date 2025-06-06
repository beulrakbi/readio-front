import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callCurationTypesAPI } from "../../apis/CurationAPICalls.js";
import bgimg1 from '../../assets/bgimg.png';
import bgimg2 from '../../assets/bgimg2.png';
import bgimg3 from '../../assets/bgimg3.png';
import bgimg4 from '../../assets/bgimg4.png';
import search from '../../assets/search.png';
import VideoList from '../../components/video/VideoList.jsx';
import EmotionModal from '../mylibrary/calendar/EmotionModal.jsx';
import UserMainCSS from './UserMain.module.css';


function UserMain() {
    // const [types, setTypes] = useState([]);
    // const allTypes = ["celeb", "goods", "habit"];
    const [userCoords, setUserCoords] = useState(null); // 위치 좌표 저장할 상태 
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTypesLoaded, setIsTypesLoaded] = useState(false);

    const [bgImage, setBgImage] = useState(null);

    useEffect(() => {
        const images = [bgimg1, bgimg2, bgimg3, bgimg4];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        setBgImage(randomImage);
    }, []);

    const today = dayjs();  // import dayjs

    const token = sessionStorage.getItem("accessToken");   //5.30 변경 테스트중
    const userId = sessionStorage.getItem("userId");   //5.30 변경 테스트중

    const types = useSelector(state => state.curation.type);
    // const token = localStorage.getItem("accessToken");

    const userIdFromSession = sessionStorage.getItem("userId");


    const convertEmojiToEnum = (emoji) => {
        switch (emoji) {
            case '🙂':
                return 'NORMAL';
            case '😁':
                return 'HAPPY';
            case '😭':
                return 'SAD';
            case '😡':
                return 'ANGRY';
            case '😵‍💫':
                return 'ANXIOUS';
            default:
                return 'NORMAL';
        }
    };

    // 위치 정보 요청
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn("위치 정보를 가져오는 것을 거부하거나 실패했습니다:", error);
                    // userCoords를 null 상태로 두면, VideoList 쪽에서 typeId=5인 경우엔
                    // 아무것도 요청하지 않고 빈 리스트를 보여주도록 처리했습니다.
                }
            );
        } else {
            console.warn("이 브라우저는 위치 정보(geolocation)를 지원하지 않습니다.");
        }
    }, []);

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");   //5.30 변경 테스트중
        const token = sessionStorage.getItem("accessToken");   //5.30 변경 테스트중
        // const userId = localStorage.getItem("userId");
        // const token = localStorage.getItem("accessToken");

        if (!token || !userId || token === 'undefined' || userId === 'undefined') return;

        const todayStr = dayjs().format('YYYY-MM-DD');
        const modalKey = `emotionModalShown_${userId}_${todayStr}`;
        // userId + 날짜 기준으로 체크
        if (!localStorage.getItem(modalKey)) {
            setIsModalOpen(true);
            localStorage.setItem(modalKey, 'true');
        }
    }, [sessionStorage.getItem("userId")]);   //5.30 변경 테스트중
    // }, [localStorage.getItem("userId")]);


    useEffect(() => {
        const fetchTypes = async () => {
            if (!token || !userId || token === 'undefined' || userId === 'undefined') {
                await dispatch(callCurationTypesAPI({ login: false }));
            } else {
                await dispatch(callCurationTypesAPI({ login: true }));
            }
            setIsTypesLoaded(true);
        };
        fetchTypes();
    }, []);


     useEffect(() => {
            const getTypes = async () => {
                const allTypes = await dispatch(callCurationTypesAPI());
                if (allTypes) {
                    const apiTypes = allTypes.data; // ← 변수명을 apiTypes로 변경

                    // 로그인 상태일 때만 “감정 기반 추천” 객체을 앞에 추가
                    let finalTypesToShow = [...apiTypes];
                    if (token && userIdFromSession) {
                        const emotionRecommendationType = {
                            typeId: 6,
                            typeName: 'Emotion',
                            typeText: `${userIdFromSession}님, 오늘 기분에 맞는 영상 어때요? 😊`
                        };
                        finalTypesToShow.unshift(emotionRecommendationType); // ← apiTypes 복사본에 추가
                    }

                    // 마지막으로 셔플해서 state에 저장
                    const shuffled = finalTypesToShow.sort(() => 0.5 - Math.random());
                    setTypes(shuffled);
                }
            }
            getTypes();
            console.log("ttttttt", types);
        }, [dispatch, token, userIdFromSession]);

    return (<>
        <div className={UserMainCSS.main}>
            <div className={UserMainCSS.mainImgBox}
            style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className={UserMainCSS.mainSearch}>
                    <div className={UserMainCSS.buttonBox}>
                        <input className={UserMainCSS.mainSearchInput} type="text" name="search"
                            placeholder="검색어를 입력하세요" />
                        <button className={UserMainCSS.buttonNone}><img src={search} /></button>
                    </div>
                    <div className={UserMainCSS.buttonBox}>
                        <button className={UserMainCSS.mainKeywordButton}>#키워드</button>
                        <button className={UserMainCSS.mainKeywordButton}>#키워드</button>
                        <button className={UserMainCSS.mainKeywordButton}>#키워드</button>
                    </div>
                </div>
            </div>
            <p className={UserMainCSS.readio}>READIO</p>
            <div className={UserMainCSS.backgroundTexture}>
                <div className={UserMainCSS.mainTextBox}>
                    <p className={UserMainCSS.mainText}>" readio는 책과 영상을 통해 마음을 연결하는 공간입니다.
                        계절처럼 변하는 하루하루,
                        당신에게 꼭 맞는 이야기를 전합니다. "</p>
                </div>
                <div className={UserMainCSS.videoSection}>
                    {isTypesLoaded && types?.length > 0 && types.map(type =>
                        <VideoList 
                                type={type} 
                                userId={userId} 
                                userCoords={userCoords}
                                key={type.typeId} 
                            />
                    )}
                </div>
            </div>
        </div>
        {isModalOpen && (<EmotionModal
            onSelect={(emoji) => {
                const userId = sessionStorage.getItem("userId");   //5.30 변경 테스트중
                // const userId = localStorage.getItem("userId");
                if (!userId || !token) {
                    alert("로그인이 필요합니다.");
                    return;
                }

                const requestData = {
                    userId: userId, emotionType: convertEmojiToEnum(emoji), date: today.format('YYYY-MM-DD')
                };

                fetch('/api/user/emotions', {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`

                    }, body: JSON.stringify(requestData)
                })
                    .then(res => {
                        if (res.ok) {
                            console.log("감정 등록 성공");
                            setIsModalOpen(false);
                        } else {
                            alert('감정 등록 실패');
                        }
                    })
                    .catch(err => {
                        console.error('감정 등록 오류:', err);
                    });
            }}
            onCancel={() => setIsModalOpen(false)}
        />)}
    </>)
}

export default UserMain;