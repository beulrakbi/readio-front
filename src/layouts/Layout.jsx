import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from '../components/common/Header';
import UserFooter from '../components/common/UserFooter';
import UserNav from "../components/common/UserNav";
import LayoutCSS from "./Layout.module.css";

function Layout()
{
    const [navOpen, setNavOpen] = useState(false);
    const [alarmOpen, setAlarmOpen] = useState(false);

    // 네비게이션 상태 토글  추가됨
    const toggleNav = () => {
        setNavOpen(prev => !prev);
    };

    // 알람 상태 토글 추가됨
    const toggleAlarm = () => {
        setAlarmOpen(prev => !prev); // 알람 상태 토글
    };

    return(
        <>
            <Header toggleNav={() => setNavOpen(prev => !prev)}/>
            <Header toggleNav={toggleNav} toggleAlarm={toggleAlarm} />
            <UserNav isOpen={navOpen}/>
            <main className={LayoutCSS.main}>
                <Outlet />
            </main>
            <UserFooter/>
        </>

    )
}

export default Layout;