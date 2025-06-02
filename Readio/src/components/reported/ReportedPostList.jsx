import {Link, useLocation, useNavigate} from "react-router-dom";
import searchIcon from '../../assets/search3.png';
import ReportedCSS from './Reported.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {callReportedPostsAPI} from "../../apis/ReportedAPICalls.js";
import FListCSS from "../adminfiltering/Filtering.module.css";

function ReportedPostList()
{
    const dispatch = useDispatch();
    const reportedPosts = useSelector(state => state.reported);
    const navigate = useNavigate();

    const pageInfo = reportedPosts.pageInfo;
    const [start, setStart] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageEnd, setPageEnd] = useState(1);
    const [filter, setFilter] = useState("2");
    const location = useLocation();
    const pageNumber = [];
    if (pageInfo) {
        for (let i = 1; i <= pageInfo.pageEnd; i++) {
            pageNumber.push(i);
        }
    }

    useEffect(() => {
        setStart((currentPage - 1) * 5);
        dispatch(callReportedPostsAPI({currentPage: currentPage}));
    }, [currentPage, location.key]);

    const onCheckHandler = (e) => {
        setFilter(e.target.id);
    }

    return (

        <div className={ReportedCSS.container}>
            <div className={ReportedCSS.fontContainer}>
                <p className={ReportedCSS.font1}>신고된 포스트 관리</p>
                <div className={ReportedCSS.searchDiv}>
                    <form className={ReportedCSS.searchForm}>
                        <input type="text"
                            name="keyword"
                            placeholder="ID / 내용 검색"
                            className={ReportedCSS.searchInput}/>
                        <button className={ReportedCSS.searchBt}>
                            <img src={searchIcon} className={ReportedCSS.searchBt}/>
                        </button>
                    </form>
                </div>
            </div>
            <hr className={ReportedCSS.reportedLine} />
            <table className={ReportedCSS.reportedTable}>
                <thead className={ReportedCSS.reportedThead}>
                    <tr>
                        <td>번호</td>
                        <td>횟수</td>
                        <td>신고일</td>
                        <td>작성자</td>
                        <td>상태</td>
                        <td>포스트 제목</td>
                    </tr>
                </thead>
                <tbody className={ReportedCSS.reportedTbody}>
                {Array.isArray(reportedPosts?.data) ?
                    (filter === "2" ? reportedPosts?.data?.map(reportedPost => {
                            let date = new Date(reportedPost.reportedDate);
                            const formatted = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
                            return (<tr key={reportedPost.reportId}
                                        onClick={() => navigate(`/admin/reported/post/${reportedPost.reportId}`)}>
                                <td>{reportedPost.reportId}</td>
                                <td>{reportedPost.reportedCount}</td>
                                <td>{formatted}</td>
                                <td>{reportedPost.userId}</td>
                                <td>{reportedPost.isHidden === "Y" ? "숨김" : "노출"}</td>
                                <td>{reportedPost.postTitle}</td>
                            </tr>);
                        }) :
                        (reportedPosts?.data?.filter(reportedPost => reportedPost.isHidden === "Y")
                            .map(reportedPost => {
                                let date = new Date(reportedPost.reportedDate);
                                const formatted = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
                                return (<tr key={reportedPost.reportId}
                                            onClick={() => navigate(`/admin/reported/post/${reportedPost.reportId}`)}>
                                    <td>{reportedPost.reportId}</td>
                                    <td>{reportedPost.reportedCount}</td>
                                    <td>{formatted}</td>
                                    <td>{reportedPost.userId}</td>
                                    <td>{reportedPost.isHidden === "Y" ? "숨김" : "노출"}</td>
                                    <td>{reportedPost.postTitle}</td>
                                </tr>);
                            })))
                    : (
                        <tr>
                            <td colSpan="6">데이터를 불러오는 중입니다...</td>
                        </tr>

                    )}
                </tbody>
            </table>
            <div className={ReportedCSS.radioBoxesDiv}>
                <div className={ReportedCSS.radioBoxDiv}>
                    <input className={ReportedCSS.radioBox} type="radio" name="filter" id="1" onClick={onCheckHandler}/>
                    <input className={ReportedCSS.radioBox} type="radio" name="filter" defaultChecked id="2"
                           onClick={onCheckHandler}/>
                </div>
                <div className={ReportedCSS.radioBoxDiv}>
                    <label className={ReportedCSS.font2} for="1">숨김처리된 포스트만 보기</label>
                    <label className={ReportedCSS.font2} for="2">전체 보기</label>
                </div>
                <div className={ReportedCSS.paging2}>
                    {Array.isArray(reportedPosts) && (<button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={FListCSS.pagingBtn}
                    >
                        &lt;
                    </button>)}
                    {pageNumber.map((num) => (<li
                        style={{all: "unset"}}
                        key={num}
                        onClick={() => setCurrentPage(num)}
                    >
                        <button
                            style={currentPage === num ? {backgroundColor: '#AF4C3F'} : null}
                            className={FListCSS.pagingBtn}
                        >
                            {num}
                        </button>
                    </li>))}
                    {Array.isArray(reportedPosts) && (<button
                        className={FListCSS.pagingBtn}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pageInfo.pageEnd || pageInfo.total == 0}
                    >
                        &gt;
                    </button>)}
                </div>
            </div>
        </div>
    )
        
}

export default ReportedPostList;