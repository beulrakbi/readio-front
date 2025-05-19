import ReportedReviewDetail from '../../../components/reported/ReportedReviewDetail';
import FilteringCSS from '../filtering/AdminFiltering.module.css';

function ReportedReviewDetailPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <ReportedReviewDetail />
            </div>
        </>
    )
}

export default ReportedReviewDetailPage;