import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from '../components/common/Header';
import UserFooter from '../components/common/UserFooter';
import UserNav from "../components/common/UserNav";
import LayoutCSS from "./Layout.module.css";

function Layout()
{
    const [navOpen, setNavOpen] = useState (false);

    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return(
        <>
            {/* <Header toggleNav={() => setNavOpen(prev => !prev)}/> */}
            <Header toggleNav={toggleNav} setIsOpen={setIsNavOpen} /> {/* setIsOpen 전달 */}
                <UserNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
            <UserNav isOpen={navOpen}/>
            <main className={LayoutCSS.main}>
                <Outlet />
            </main>
            <UserFooter/>
        </>

    )
}

export default Layout;