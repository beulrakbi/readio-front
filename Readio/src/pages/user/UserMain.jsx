import search from '../../assets/search.png';
import VideoList from '../../components/video/VideoList.jsx';
import UserMainCSS from './UserMain.module.css';
import {useEffect, useState} from "react";
import EmotionModal from '../mylibrary/calendar/EmotionModal.jsx';
import dayjs from 'dayjs';
import {callCurationTypesAPI} from "../../apis/CurationAPICalls.js";
import {useDispatch} from "react-redux";


function UserMain() {
    const [types, setTypes] = useState([]);
    // const allTypes = ["celeb", "goods", "habit"];
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const today = dayjs();  // import dayjs
    const token = localStorage.getItem("accessToken");

    const convertEmojiToEnum = (emoji) => {
        switch (emoji) {
            case '🙂': return 'NORMAL';
            case '😁': return 'HAPPY';
            case '😭': return 'SAD';
            case '😡': return 'ANGRY';
            case '😵‍💫': return 'ANXIOUS';
            default: return 'NORMAL';
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            console.log(" userId/token 없음 - 모달 안 뜸");
            return;
        }

        const todayKey = `emotionModalShown_${userId}_${new Date().toISOString().slice(0, 10)}`;
        console.log(" todayKey:", todayKey);

        if (!localStorage.getItem(todayKey)) {
            setIsModalOpen(true);
            localStorage.setItem(todayKey, 'true');
        }
    }, []);

    useEffect(() => {
        const getTypes = async () => {
            const allTypes = await dispatch(callCurationTypesAPI());
            if (allTypes) {
                const types = allTypes.data;
                const shuffled = [...types].sort(() => 0.5 - Math.random()); // 랜덤 셔플
                setTypes(shuffled);
            }
        }
        getTypes();
        console.log("ttttttt", types);
    }, []);

    return (<>
            <div className={UserMainCSS.main}>
                <div className={UserMainCSS.mainImgBox}>
                    <div className={UserMainCSS.mainSearch}>
                        <div className={UserMainCSS.buttonBox}>
                            <input className={UserMainCSS.mainSearchInput} type="text" name="search"
                                   placeholder="검색어를 입력하세요"/>
                            <button className={UserMainCSS.buttonNone}><img src={search}/></button>
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
                        <VideoList type={types[0]}/>
                        <VideoList type={types[1]}/>
                        <VideoList type={types[2]}/>

                    </div>
                </div>
            </div>
            {isModalOpen && (
                <EmotionModal
                    onSelect={(emoji) => {
                        const userId = localStorage.getItem("userId");
                        if (!userId || !token) {
                            alert("로그인이 필요합니다.");
                            return;
                        }

                        const requestData = {
                            userId: userId,
                            emotionType: convertEmojiToEnum(emoji),
                            date: today.format('YYYY-MM-DD')
                        };

                        fetch('/api/user/emotions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(requestData)
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
                />
            )}
        </>
    )

}

export default UserMain;