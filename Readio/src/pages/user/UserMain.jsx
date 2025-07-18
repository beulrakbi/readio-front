import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callCurationTypesAPI } from "../../apis/CurationAPICalls.js";
import VideoList from '../../components/video/VideoList.jsx';
import EmotionModal from '../mylibrary/calendar/EmotionModal.jsx';
import SearchBox from '../searchList/SearchBox.jsx';
import UserMainCSS from './UserMain.module.css';


function UserMain() {

    const [shuffledTypes, setShuffledTypes] = useState([]);
    // const [types, setTypes] = useState([]);
    // const allTypes = ["celeb", "goods", "habit"];
    const [userCoords, setUserCoords] = useState(null); // 위치 좌표 저장할 상태 
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTypesLoaded, setIsTypesLoaded] = useState(false);

    const today = dayjs();  // import dayjs

    const token = sessionStorage.getItem("accessToken");   //5.30 변경 테스트중
    const userId = sessionStorage.getItem("userId");   //5.30 변경 테스트중

    const types = useSelector(state => state.curation.type);
    // const token = localStorage.getItem("accessToken");


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
                dispatch(callCurationTypesAPI({ login: "false" }));
            } else {
                dispatch(callCurationTypesAPI({ login: "true" }));
            }
        };
        fetchTypes();
    }, []);

    useEffect(() => {
        if (types)
        {
            const shuffled = [...types].sort(() => 0.5 - Math.random());
            setShuffledTypes(shuffled);
            setIsTypesLoaded(true);
        }
    }, [types, isTypesLoaded])

    return (<>
        <div className={UserMainCSS.main}>

            <SearchBox />

            <p className={UserMainCSS.readio}>READIO</p>
            <div className={UserMainCSS.backgroundTexture}>
                <div className={UserMainCSS.mainTextBox}>
                    <p className={UserMainCSS.mainText}>" readio는 책과 영상을 통해 마음을 연결하는 공간입니다.
                        계절처럼 변하는 하루하루,
                        당신에게 꼭 맞는 이야기를 전합니다. "</p>
                </div>
                <div className={UserMainCSS.videoSection}>
                    {isTypesLoaded && shuffledTypes.length > 0 && shuffledTypes.map(type =>
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