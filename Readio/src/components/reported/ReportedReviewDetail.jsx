import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';
import ReportedCSS from './Reported.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {callReportedReviewAPI, callReportedReviewUpdateAPI} from "../../apis/ReportedAPICalls.js";



function ReportedReviewDetail()
{
    const param = useParams();
    const reportedReviewDetail = useSelector(state => state.reported.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(callReportedReviewAPI({reportId: param.reportId}));
        console.log("param", param);
    }, [])


    useEffect(() => {
        console.log("reportedReviewDetail", reportedReviewDetail);
    }, [reportedReviewDetail]);

    const statusUpdate = () => {
        if (reportedReviewDetail.isHidden === "Y")
        {
            if(confirm('노출처리 하시겠습니까?'))
            {
                dispatch(callReportedReviewUpdateAPI({reportId: param.reportId}));
            }
        }
        else
        {
            if(confirm('숨김처리 하시겠습니까?'))
            {
                dispatch(callReportedReviewUpdateAPI({reportId: param.reportId}));
            }

        }
    }


    const createdAt = new Date(reportedReviewDetail.createdAt);
    const createdAtFormatted = `${createdAt.getFullYear()}. ${String(createdAt.getMonth() + 1).padStart(2, '0')}. ${String(createdAt.getDate()).padStart(2, '0')}`;
    const reportedAt = new Date(reportedReviewDetail.reportedDate);
    const reportedAtFormatted = `${reportedAt.getFullYear()}. ${String(reportedAt.getMonth() + 1).padStart(2, '0')}. ${String(reportedAt.getDate()).padStart(2, '0')}`;

    return (
        <div className={ReportedCSS.container}>
            <div className={ReportedCSS.fontContainer}>
                <p className={ReportedCSS.font1}>{reportedReviewDetail.userId}의 댓글</p>
                <p className={ReportedCSS.font3} onClick={statusUpdate}>{reportedReviewDetail.isHidden === "Y" ? "노출" : "숨김"}</p>
            </div>
            <hr className={ReportedCSS.reportedLine} />
            <div className={ReportedCSS.reportedContent}>
                <table className={ReportedCSS.reportedContentTable}>
                    <tbody>
                        <tr>
                            <td>작성일</td>
                            <td>{createdAtFormatted}</td>
                        </tr>
                        <tr>
                            <td>최근 신고일</td>
                            <td>{reportedAtFormatted}</td>
                        </tr>
                        <tr>
                            <td>신고된 횟수</td>
                            <td>{reportedReviewDetail.reportedCount}</td>
                        </tr>
                        <tr>
                            <td>처리 상태</td>
                            <td>{reportedReviewDetail.isHidden === "Y" ? "숨김" : "노출"}</td>
                        </tr>
                        <tr>
                            <td>리뷰 작성 위치</td>
                            <td style={{cursor:"pointer"}} onClick={() => navigate(`/bookPage/${reportedReviewDetail.bookIsbn}`)}>https://localhost:5173/bookPage/{reportedReviewDetail.bookIsbn}</td>
                        </tr>
                        <tr>
                            <td>내용</td>
                        </tr>
                    </tbody>
                </table>
                <p>{reportedReviewDetail.reviewContent}</p>
            </div>
            <hr className={ReportedCSS.reportedLine} />
            <div className={ReportedCSS.paging}>
                <p onClick={() => navigate(`/admin/reported/review`,  { state: { reset: true } })} className={ReportedCSS.font2}>뒤로가기</p>
            </div>
        </div>

    )
}

export default ReportedReviewDetail;