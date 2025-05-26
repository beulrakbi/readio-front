import CurationCSS from "./Curation.module.css";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {callAllCurationTypesAndKeywordsAPI} from "../../apis/CurationAPICalls.js";

function CurationManager()
{
    const dispatch = useDispatch();
    const curationTypes = useSelector(state => state.curation);
    useEffect(() => {
        dispatch(callAllCurationTypesAndKeywordsAPI());
    }, [dispatch]);

    useEffect(() => {
        console.log(curationTypes); // 실제 값이 바뀔 때마다 로그 찍힘
    }, [curationTypes]);

    return (
        <div className={CurationCSS.container}>
            <div className={CurationCSS.fontContainer}>
                <p className={CurationCSS.font1}>영상 키워드 관리</p>
                <select>
                    {curationTypes.type.map(curation => (<option key={curation.typeId}>{curation.typeName}</option>))}
                </select>
                <div className={CurationCSS.buttonDiv}>
                </div>
            </div>
            <hr className={CurationCSS.filteringLine}/>

            <div className={CurationCSS.filteringDetailContent}>
                <p className={CurationCSS.font4}>test</p>
                <div className={CurationCSS.filteringKeywords}>
                </div>
            </div>
            <p className={CurationCSS.font3}>필터링된 영상</p>
            <hr className={CurationCSS.filteringLine}/>
            <div className={CurationCSS.filteringKeywords}>
            </div>
            <hr className={CurationCSS.filteringLine}/>
            <div className={CurationCSS.paging}>
                <p className={CurationCSS.font2}><Link className={CurationCSS.link} to="/"></Link></p>
            </div>
        </div>
    )
}

export default CurationManager;