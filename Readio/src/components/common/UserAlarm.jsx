import { useState } from "react";
import { NavLink } from "react-router-dom";
import UserAlarmCSS from './alarm.module.css';
import bellIcon from '../../assets/alarm.png';  // 알람 아이콘

function UserAlarm({ isOpen }) {
    // 알람 항목을 상태로 관리
    const [alarms, setAlarms] = useState([
        { id: 1, text: "댓글 좋아요" },
        { id: 2, text: "팔로우" },
        { id: 3, text: "업적" },
        { id: 4, text: "Q&A" },
        { id: 5, text: "소식" }
    ]);

    // 알람 항목 삭제 함수
    const removeAlarm = (id) => {
        // 해당 id를 가진 알람 항목을 필터링하여 삭제
        setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== id));
    };

    return (
        <>
            <div className={`${UserAlarmCSS.alarm} ${isOpen ? UserAlarmCSS.open : ''}`}>
                <div className={UserAlarmCSS.alarmContainer}>
                    {alarms.map((alarm) => (
                        <div key={alarm.id} className={UserAlarmCSS.alarmItem}>
                            <img src={bellIcon} alt="Alarm Icon" className={UserAlarmCSS.alarmIcon} />
                            <NavLink to="/" className={UserAlarmCSS.alarmLinkText}>{alarm.text}</NavLink>
                            {/* X 버튼 클릭 시 해당 알람 삭제 */}
                            <button className={UserAlarmCSS.closeButton} onClick={() => removeAlarm(alarm.id)}>
                                ✖
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default UserAlarm;