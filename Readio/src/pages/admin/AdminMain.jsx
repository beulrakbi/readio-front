import CurrentState from '../../components/adminmain/CurrentState';
import Events from '../../components/adminmain/Events';
import TopBooks from '../../components/adminmain/TopBooks';
import TopInterestsKeyword from '../../components/adminmain/TopInterestsKeywords';
import TopVideos from '../../components/adminmain/TopVideos';
import AdminMainCSS from './AdminMain.module.css';

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