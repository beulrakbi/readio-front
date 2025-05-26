import FListCSS from './Filtering.module.css';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {callFilteringGroupsAPI} from "../../apis/FilteringAPICalls.js";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

function FilteringList()
{

    const dispatch = useDispatch();
    const filteringGroups  = useSelector(state => state.filtering);
    const filteringGroupList = filteringGroups.data;
    const navigate = useNavigate();

    const pageInfo = filteringGroups.pageInfo;
    const [start, setStart] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageEnd, setPageEnd] = useState(1);
    const pageNumber = [];
    if (pageInfo) {
        for (let i = 1; i <= pageInfo.pageEnd; i++) {
            pageNumber.push(i);
        }
    }

    useEffect(() => {
        setStart((currentPage - 1) * 5);
        dispatch(callFilteringGroupsAPI({currentPage: currentPage}));
    }, [currentPage]);

    const onClickFilteringGroupHandler = (groupId) => {
        navigate(`/admin/filtering/${groupId}`);
    }


    return (
        <div className={FListCSS.container}>
            <div className={FListCSS.fontContainer}>
                <p className={FListCSS.font1}>영상 필터링 목록 조회</p>
                <p className={FListCSS.font2}><Link to="/admin/filtering/create" className={FListCSS.link}>필터링 추가</Link></p>
            </div>
            <hr className={FListCSS.filteringLine} />
            <table className={FListCSS.filteringTable}>
                <thead className={FListCSS.filteringThead}>
                    <tr>
                        <td>번호</td>
                        <td>상태</td>
                        <td>등록일</td>
                        <td>제목</td>
                    </tr>
                </thead>
                <tbody className={FListCSS.filteringTbody}>
                    {filteringGroupList?.map?.((filteringGroup) => (

                    <tr key={filteringGroup.groupId}>
                        <td>{filteringGroup.groupId}</td>
                        <td>{filteringGroup.isActive === "Y" ? "활성" : "비활성"}</td>
                        <td>{dayjs(filteringGroup.createAt).format('YYYY-MM-DD')}</td>
                        <td onClick={() => onClickFilteringGroupHandler(filteringGroup.groupId)}>{filteringGroup.title}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className={FListCSS.paging}>
                {Array.isArray(filteringGroupList) && (
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={FListCSS.pagingBtn}
                    >
                        &lt;
                    </button>
                )}
                {pageNumber.map((num) => (
                    <li
                        style={{all:"unset"}}
                        key={num}
                        onClick={() => setCurrentPage(num)}
                    >
                        <button
                            style={
                                currentPage === num
                                    ? { backgroundColor: '#AF4C3F' }
                                    : null
                            }
                            className={FListCSS.pagingBtn}
                        >
                            {num}
                        </button>
                    </li>
                ))}
                {Array.isArray(filteringGroupList) && (
                    <button
                        className={FListCSS.pagingBtn}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={
                            currentPage === pageInfo.pageEnd ||
                            pageInfo.total == 0
                        }
                    >
                        &gt;
                    </button>
                )}
            </div>
        </div>


    )
}

export default FilteringList;
