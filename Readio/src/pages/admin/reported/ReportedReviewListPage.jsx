import ReportedReviewList from '../../../components/reported/ReportedReivewList';
import FilteringCSS from '../filtering/AdminFiltering.module.css';

function ReportedReviewListPage()
{
    return (
        <>
            <div className={FilteringCSS.main}>
                <ReportedReviewList />
            </div>
        </>
    )
}

export default ReportedReviewListPage;