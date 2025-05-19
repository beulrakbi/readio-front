import { Link } from "react-router-dom";
import FListCSS from './Filtering.module.css';

function FilteringDetail()
{
    return (
        <div className={FListCSS.container}>
            <div className={FListCSS.fontContainer}>
                <p className={FListCSS.font1}>필터링 제목1</p>
                <div className={FListCSS.buttonDiv}>
                    <p className={FListCSS.font2}><Link className={FListCSS.link} to="/">활성화</Link></p>
                    <p className={FListCSS.font2}><Link className={FListCSS.link} to="/">수정</Link></p>
                    <p className={FListCSS.font2}><Link className={FListCSS.link} to="/">삭제</Link></p>
                </div>
            </div>
            <hr className={FListCSS.filteringLine}/>
            <div className={FListCSS.filteringDetailContent}>
                <p className={FListCSS.font4}>해당 영상들은 ㅁㄴㅇㄹ한 이유로 필터링됨</p>
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