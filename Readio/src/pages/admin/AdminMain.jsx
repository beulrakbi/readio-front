import CurrentState from '../../components/adminmain/CurrentState';
import Events from '../../components/adminmain/Events';
import TopInterestsKeyword from '../../components/adminmain/TopInterestsKeywords';
import TopVideos from '../../components/adminmain/TopVideos';
import AdminMainCSS from './AdminMain.module.css';
import TopBooks from '../../components/adminmain/TopBooks';

function AdminMain()
{
    return (
        <>
            <div className={AdminMainCSS.main}>
                <div className={AdminMainCSS.container}>
                    <CurrentState/>
                    <Events/>
                </div>
                <div className={AdminMainCSS.container}>
                    <TopVideos/>
                    <TopBooks/>
                </div>
                <div className={AdminMainCSS.container}>
                    <TopInterestsKeyword/>
                </div>
            </div>
        </>
    )
}

export default AdminMain;