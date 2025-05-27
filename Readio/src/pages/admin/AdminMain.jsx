import { useEffect, useState } from 'react';
import axiosInstance from '../../apis/axiosInstance';
import CurrentState from '../../components/adminmain/CurrentState';
import Events from '../../components/adminmain/Events';
import TopBooks from '../../components/adminmain/TopBooks';
import TopInterestsKeyword from '../../components/adminmain/TopInterestsKeywords';
import TopVideos from '../../components/adminmain/TopVideos';
import AdminMainCSS from './AdminMain.module.css';

function AdminMain() {

    
    // 공통적으로 axios 인스턴스를 사용하여 Authorization 헤더(토큰)를 자동 추가함
    // 필요 시 axiosInstance.get('/api/endpoint')로 요청하시면 됩니다.
    // 페이지 안 나올시 import 확인해보세요
    // ----------------------- 시작
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        axiosInstance.get('/admin')
            .then(response => setUserData(response.data))
            .catch(error => console.error(error))
    }, []);

    // ----------------------- 끝

    return (
        <>
            <div className={AdminMainCSS.main}>
                <div className={AdminMainCSS.container}>
                    <CurrentState />
                    <Events />
                </div>
                <div className={AdminMainCSS.container}>
                    <TopVideos />
                    <TopBooks />
                </div>
                <div className={AdminMainCSS.container}>
                    <TopInterestsKeyword />
                </div>
            </div>
        </>
    )
}

export default AdminMain;