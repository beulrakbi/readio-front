import FListCSS from './Filtering.module.css';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {callFilteringGroupCreateAPI} from "../../apis/FilteringAPICalls.js";
import {useEffect} from "react";

function FilteringList()
{
    // callFilteringGroupCreateAPI();

    // const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const params = useParams();
    // const filteringGroups  = useSelector(state => state.filteringReducer);
    // const filteringGroupList = filteringGroups.data;
    //
    // useEffect(() => {
    //     dispatch(callFilteringGroupCreateAPI({
    //
    //     }))
    // }, []);

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
                    <tr>
                        <td>10</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>비활성화</td>
                        <td>2025.04.01</td>
                        <td><Link to="/" className={FListCSS.link}>필터링 제목 1</Link></td>
                    </tr>
                </tbody>
            </table>
            <div className={FListCSS.paging}>
                <p>1 2 3 4 5</p> 
            </div>
        </div>


    )
}

export default FilteringList;
