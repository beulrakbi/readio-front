import {Link, useParams} from "react-router-dom";
import FListCSS from './Filtering.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {callFilteringGroupAPI} from "../../apis/FilteringAPICalls.js";

function FilteringDetail()
{
    const dispatch = useDispatch();
    const filteringGroup  = useSelector(state => state.filtering);
    const param = useParams();
    console.log("filteringGroup", filteringGroup);

    useEffect(() => {
        dispatch(callFilteringGroupAPI({groupId:param.groupId}));
    }, []);


    return (
        filteringGroup &&
        <div className={FListCSS.container}>
            <div className={FListCSS.fontContainer}>
                <p className={FListCSS.font1}>{filteringGroup.title}</p>
                <div className={FListCSS.buttonDiv}>
                    <p className={FListCSS.font2}><Link className={FListCSS.link} to="/">활성화</Link></p>
                    <p className={FListCSS.font2}><Link className={FListCSS.link} to="/">수정</Link></p>
                    <p className={FListCSS.font2}><Link className={FListCSS.link} to="/">삭제</Link></p>
                </div>
            </div>
            <hr className={FListCSS.filteringLine}/>
            <div className={FListCSS.filteringDetailContent}>
                <p className={FListCSS.font4}>{filteringGroup.content}</p>
                <div className={FListCSS.filteringKeywords}>
                    <p className={FListCSS.filteringKeyword}>48goLblvWvsSnT01</p>
                    <p className={FListCSS.filteringKeyword}>ㅇㅇ</p>
                    <p className={FListCSS.filteringKeyword}>ㅇㅇ</p>
                </div>
            </div>
                <p className={FListCSS.font3}>필터링된 영상</p>
            <hr className={FListCSS.filteringLine}/>
                <div className={FListCSS.filteringKeywords}>
                </div>
            <hr className={FListCSS.filteringLine}/>
            <div className={FListCSS.paging}>
                <p className={FListCSS.font2}><Link className={FListCSS.link} to="/"></Link></p>
            </div>
        </div>
    )
}

export default FilteringDetail;