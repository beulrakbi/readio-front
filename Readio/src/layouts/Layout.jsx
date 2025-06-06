import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from '../components/common/Header';
import UserFooter from '../components/common/UserFooter';
import UserNav from "../components/common/UserNav";
import LayoutCSS from "./Layout.module.css";

function Layout()
{
    const [navOpen, setNavOpen] = useState (false);

    return(
        <>
            {/* <Header toggleNav={() => setNavOpen(prev => !prev)}/> */}
             <Header toggleNav={() => setNavOpen(!navOpen)} setIsNavOpen={setNavOpen} />
            <UserNav isOpen={navOpen} setIsOpen={setNavOpen}  />

            {/* 오버레이: Nav가 열렸을 때만 표시 */}
            {navOpen && (
                <div
                    className={LayoutCSS.overlay}
                    onClick={() => setNavOpen(false)}
                />
            )}

            <main className={LayoutCSS.main}>
                <Outlet />
            </main>

            <UserFooter/>
        </>

    )
}

export default Layout;