import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import UserNav from "../components/common/UserNav";
import LayoutCSS from "./Layout.module.css";
import UserFooter from "../components/common/UserFooter";
function Layout()
{
    const [navOpen, setNavOpen] = useState(false);

    return(
        <>
            <Header toggleNav={() => setNavOpen(prev => !prev)}/>
            <UserNav isOpen={navOpen}/>
            <main className={LayoutCSS.main}>
                <Outlet />
            </main>
            <UserFooter />
        </>

    )
}

export default Layout;