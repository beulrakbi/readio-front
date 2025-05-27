import CurationCSS from "./Curation.module.css";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {callAllCurationTypesAndKeywordsAPI} from "../../apis/CurationAPICalls.js";

function CurationManager()
{
    const dispatch = useDispatch();
    const curation = useSelector(state => state.curation);
    const [type, setType] = useState('');
    const [keywords, setKeywords] = useState([]);

    const onChangeSelect = (e) => {
        setType(e.target.name);
        setKeywords(curation.curations.filter());
        console.log()
    }

    useEffect(() => {
        dispatch(callAllCurationTypesAndKeywordsAPI());
    }, [dispatch]);

    useEffect(() => {
        console.log("test", curation); // 실제 값이 바뀔 때마다 로그 찍힘
    }, [curation]);

    return (
        <div className={CurationCSS.container}>
            <div className={CurationCSS.fontContainer}>
                <p className={CurationCSS.font1}>영상 키워드 관리</p>
                <select onChange={onChangeSelect}>
                    {curation.curations.map(cu => (<option key={cu.type.typeId} name={cu.type.typeId}>{cu.type.typeName}</option>))}
                </select>
                <div className={CurationCSS.buttonDiv}>
                </div>
            </div>
            <hr className={CurationCSS.filteringLine}/>

            <div className={CurationCSS.filteringDetailContent}>
                <p className={CurationCSS.font4}>
                    {keywords.map(keyword => (
                        <p className={CurationCSS.filteringKeyword} key={keyword.curationId}>{keyword.keyword}</p>
                     ))}
                </p>
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