import ReportedPostDetail from '../../../components/reported/ReportedPostDetail';
import FilteringCSS from '../filtering/AdminFiltering.module.css';

function ReportedPostDetailPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <ReportedPostDetail />
            </div>
        </>
    )
}

export default ReportedPostDetailPage;