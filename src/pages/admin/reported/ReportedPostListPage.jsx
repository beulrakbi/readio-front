import ReportedPostList from '../../../components/reported/ReportedPostList';
import FilteringCSS from '../filtering/AdminFiltering.module.css';

function ReportedPostListPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <ReportedPostList />
            </div>
        </>
    )
}

export default ReportedPostListPage;