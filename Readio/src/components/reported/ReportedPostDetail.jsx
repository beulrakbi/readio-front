import {Link, useNavigate, useParams} from 'react-router-dom';
import ReportedCSS from './Reported.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
    callReportedPostAPI,
    callReportedPostUpdateAPI,
    callReportedReviewAPI,
    callReportedReviewUpdateAPI
} from "../../apis/ReportedAPICalls.js";



function ReportedPostDetail()
{
    const param = useParams();
    const reportedPostDetail = useSelector(state => state.reported.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(callReportedPostAPI({reportId: param.reportId}));
    }, [])

    const statusUpdate = () => {
        if (reportedPostDetail.isHidden === "Y")
        {
            if(confirm('노출처리 하시겠습니까?'))
            {
                dispatch(callReportedPostUpdateAPI({reportId: param.reportId}));
            }
        }
        else
        {
            if(confirm('숨김처리 하시겠습니까?'))
            {
                dispatch(callReportedPostUpdateAPI({reportId: param.reportId}));
            }

        }
    }


    const createdAt = new Date(reportedPostDetail.postCreatedAt);
    const createdAtFormatted = `${createdAt.getFullYear()}. ${String(createdAt.getMonth() + 1).padStart(2, '0')}. ${String(createdAt.getDate()).padStart(2, '0')}`;
    const reportedAt = new Date(reportedPostDetail.reportedDate);
    const reportedAtFormatted = `${reportedAt.getFullYear()}. ${String(reportedAt.getMonth() + 1).padStart(2, '0')}. ${String(reportedAt.getDate()).padStart(2, '0')}`;


    return (
        <div className={ReportedCSS.container}>
            <div className={ReportedCSS.fontContainer}>
                <p className={ReportedCSS.font1}>{reportedPostDetail.postTitle}</p>
                <p className={ReportedCSS.font3} onClick={statusUpdate}>{reportedPostDetail.isHidden === "Y" ? "노출" : "숨김"}</p>
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
                            <td>{reportedPostDetail.reportedCount}</td>
                        </tr>
                        <tr>
                            <td>처리 상태</td>
                            <td>{reportedPostDetail.isHidden === "Y" ? "숨김" : "노출"}</td>
                        </tr>
                        <tr>
                            <td>포스트 작성 위치</td>
                            <td style={{cursor: "pointer"}}
                                onClick={() => navigate(`/mylibrary/post/${reportedPostDetail.postId}`)}>https://localhost:5173/mylibrary/post/{reportedPostDetail.postId}</td>
                        </tr>
                        <tr>
                            <td>내용</td>
                        </tr>
                    </tbody>
                </table>
                <p>{reportedPostDetail.postContent}</p>
            </div>
            <hr className={ReportedCSS.reportedLine} />
            <div className={ReportedCSS.paging}>
                <p onClick={() => navigate(`/admin/reported/post`,  { state: { reset: true } })} className={ReportedCSS.font2}>뒤로가기</p>
            </div>
        </div>

    )
}

export default ReportedPostDetail;