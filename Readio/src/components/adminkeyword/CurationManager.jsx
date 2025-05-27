import CurationCSS from "./Curation.module.css";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {callAllCurationTypesAndKeywordsAPI} from "../../apis/CurationAPICalls.js";
import {callFilteringGroupUpdateAPI} from "../../apis/FilteringAPICalls.js";
import {useNavigate} from "react-router-dom";

function CurationManager() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const curation = useSelector(state => state.curation);
    const [keywordsType, setKeywordsType] = useState({});
    const [keywords, setKeywords] = useState([{}]);
    const [id, setId] = useState(0);
    const [typeId, setTypeId] = useState(-1);
    const [newKeyword, setNewKeyword] = useState([]);

    const onChangeSelect = (e) => {
        setTypeId(Number(e.target.value - 1));
    }

    const CreateKeyword = () => {
        if (keywords.length < 15) {
            setKeywords(prev => [...prev, {orderNum: id, keyword: '', type: typeId, isUnsaved: true}]);
            setId(id + 1);
        } else {
            alert('더이상 추가할 수 없습니다');
        }
    }

    const onChangeHandler2 = (e) => {
        console.log(e.target.name, e.target.value);
        setNewKeyword({
            ...newKeyword, [e.target.name]: e.target.value,
        });
    };

    const enterKeyword = (e, orderNum) => {
        setKeywords(prev => prev.map(word => word.orderNum === orderNum ? {
            ...word, orderNum: id, keyword: e.target.value, type: typeId, isUnsaved: false
        } : word));
    }

    const deleteKeyword = (num) => {
        setKeywords(prev => prev.filter(keyword => keyword.orderNum !== num));
    }

    // 맨 처음
    useEffect(() => {
        dispatch(callAllCurationTypesAndKeywordsAPI());
        setId(0);
        setKeywordsType(curation.type[0] || []);
        const savedKeywords = curation.keywords?.map((word,index) => ({
            orderNum: index, keyword: word.keyword, isUnsaved: false, type: word.type
        }));
        setKeywords(savedKeywords);
        setId(savedKeywords?.length || 0);
    }, []);

    useEffect(() => {
        setKeywords([])
        setId(0);
        setKeywordsType(curation.type[typeId] || []);
        const savedKeywords = curation.keywords[typeId]?.keywords.map((word, index) => ({
            orderNum: index, keyword: word.keyword, isUnsaved: false, type: word.type
        }));
        setKeywords(savedKeywords);
        setId(savedKeywords?.length || 0);

    }, [typeId]);

    const save = async () => {
        try {

            const newFinal = {
                type: {
                    typeText: keywordsType.typeText,
                },
                keywords: keywords
            };

            dispatch(callFilteringGroupUpdateAPI({final:newFinal}));
            navigate(`/admin/curation`);

        } catch (error) {
            console.error("Error in save:", error);
        }

    }


    return (<div className={CurationCSS.container}>
        <div className={CurationCSS.fontContainer}>
            <p className={CurationCSS.font1}>영상 키워드 관리</p>
            <select onChange={onChangeSelect} defaultValue={typeId} style={{"border": "none"}}
                    className={CurationCSS.filteringKeyword}>
                <option value="0">None</option>
                {curation.type?.map(cu => (<option key={cu.type.typeId} value={cu.type.typeId}>
                    {cu.type.typeName}
                </option>))}
            </select>
            <div className={CurationCSS.buttonDiv}>
            </div>
        </div>
        <hr className={CurationCSS.filteringLine}/>
        <div className={CurationCSS.filteringDetailContent}>
            {typeId < 0 ? null : <input type="text" value={keywordsType?.type?.typeText}/>}
            <div className={CurationCSS.filteringKeywords}>
                {keywords?.map(word => (<div className={CurationCSS.filteringWrapper} key={word.orderNum}>
                        {!word.isUnsaved ? (<p className={CurationCSS.savedKeyword}>{word.keyword}</p>)
                            :
                            (<input className={CurationCSS.filteringInput} type="text"
                                    placeholder="입력하세요"
                                    name="keyword"
                                    onChange={onChangeHandler2}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter') {
                                            enterKeyword(e, word.orderNum);
                                        }
                                    }}
                            />)}
                        <button className={CurationCSS.noneBt} type="button"
                                onClick={() => deleteKeyword(word.orderNum)}>X
                        </button>
                    </div>))}
                {typeId < 0 ? null : <button className={CurationCSS.redBt} onClick={CreateKeyword}>+</button>}
            </div>
        </div>
        <hr className={CurationCSS.filteringLine}/>
    <div className={CurationCSS.paging}>
        <p className={CurationCSS.font2}>저장하기</p>
    </div>
</div>)
}

export default CurationManager;