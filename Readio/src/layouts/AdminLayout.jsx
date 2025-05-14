import { Outlet } from 'react-router-dom';
import AdminFooter from '../components/common/AdminFooter';
import AdminNavbar from '../components/common/AdminNavbar';
import styles from './AdminLayout.module.css';

function AdminLayout()
{
    return (
        <>
            <div className={styles.container}>
                <AdminNavbar />       
            <div className={styles.main}>
                <Outlet />
                <AdminFooter />
            </div>
            </div>
        </>
    )
}

export default AdminLayout;