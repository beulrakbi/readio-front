import FListCSS from './Filtering.module.css';
import {Link, replace, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {callFilteringGroupsAPI} from "../../apis/FilteringAPICalls.js";
import {useEffect} from "react";

function FilteringList()
{

    const dispatch = useDispatch();
    const filteringGroups  = useSelector(state => state.filtering);
    const filteringGroupList = filteringGroups.data;
    const navigate = useNavigate();
    console.log("filteringGroupList", filteringGroupList);

    useEffect(() => {
        dispatch(callFilteringGroupsAPI());
    }, []);

    const onClickFilteringGroupHandler = (groupId) => {
        navigate(`/admin/filtering/${groupId}`, {replace : true});
    }

    // console.log("filteringGroups", filteringGroups);
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
                    {filteringGroupList?.data?.map?.((filteringGroup) => (

                    <tr key={filteringGroup.groupId}>
                        <td>{filteringGroup.groupId}</td>
                        <td>{filteringGroup.isActive ? "활성" : "비활성"}</td>
                        <td>{filteringGroup.createAt}</td>
                        <td onClick={() => onClickFilteringGroupHandler(filteringGroup.groupId)}>{filteringGroup.title}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className={FListCSS.paging}>
                <p>1 2 3 4 5</p> 
            </div>
        </div>


    )
}

export default FilteringList;
