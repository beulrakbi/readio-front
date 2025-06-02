import {Link, useNavigate, useParams} from "react-router-dom";
import FListCSS from './Filtering.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
    callFilteringGroupActiveStateUpdateAPI,
    callFilteringGroupAPI,
    callFilteringGroupDeleteAPI
} from "../../apis/FilteringAPICalls.js";

function FilteringDetail()
{
    const dispatch = useDispatch();
    const filtering  = useSelector(state => state.filtering);
    const param = useParams();
    const navigate = useNavigate();
    const data = filtering.data;
    console.log("filtering result", filtering)

    useEffect(() => {
        dispatch(callFilteringGroupAPI({groupId:param.groupId}));
    }, []);

    const onClickChangeActiveState = () => {
        if (confirm('상태를 변경하시겠습니까?'))
        {
            dispatch(callFilteringGroupActiveStateUpdateAPI({groupForm:data.filteringGroup}));
            navigate(`/admin/filtering`);
        }
    }

    const onClickDelete = () => {
        if (confirm('삭제하시겠습니까?'))
        {
            dispatch(callFilteringGroupDeleteAPI({groupId:param.groupId}));
            navigate(`/admin/filtering`);
        }
    }


    return (
        <div className={FListCSS.container}>
            <div className={FListCSS.fontContainer}>
                <p className={FListCSS.font1}>{data?.filteringGroup?.title}</p>
                <div className={FListCSS.buttonDiv}>
                    <p className={FListCSS.font2} onClick={onClickChangeActiveState}>{data?.filteringGroup?.isActive == "Y" ? "비활성화" : "활성화"}</p>
                    <p className={FListCSS.font2} onClick={() => navigate(`/admin/filtering/${data.filteringGroup.groupId}/edit`)}>수정</p>
                    <p className={FListCSS.font2} onClick={onClickDelete}>삭제</p>
                </div>
            </div>
            <hr className={FListCSS.filteringLine}/>

            <div className={FListCSS.filteringDetailContent}>
                <p className={FListCSS.font4}>{data?.filteringGroup?.content}</p>
                <div className={FListCSS.filteringKeywords}>
                    {data?.filterings?.map(filter => (
                        <p className={FListCSS.filteringKeyword} key={filter.filteringId}>{filter.keyword? filter.keyword : filter.videoId}</p>
                    ))}
                </div>
            </div>
                <p className={FListCSS.font3}>필터링된 영상</p>
            <hr className={FListCSS.filteringLine}/>
                <div className={FListCSS.filteringKeywords}>
                </div>
            <hr className={FListCSS.filteringLine}/>
            <div className={FListCSS.paging}>
                <p className={FListCSS.font2} onClick={() => navigate(-1)}>뒤로가기</p>
            </div>
        </div>
    )
}

export default FilteringDetail;