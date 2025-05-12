import { Outlet } from 'react-router-dom';
import AdminFooter from '../components/common/AdminFooter';
import AdminNavbar from '../components/common/AdminNavbar';
import LayoutCSS from "./AdminLayout.module.css";

function AdminLayout()
{
    return (
        <>
            <div className={LayoutCSS.main}>
                <AdminNavbar />
                <Outlet/>
                <AdminFooter />
            </div>
        </>
    )
}

export default AdminLayout;