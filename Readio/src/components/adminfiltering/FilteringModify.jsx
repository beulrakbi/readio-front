import {useEffect, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import FListCSS from './Filtering.module.css';
import {useDispatch, useSelector} from "react-redux";
import {callFilteringGroupAPI, callFilteringGroupUpdateAPI} from "../../apis/FilteringAPICalls.js";
import {callCurationTypesForAdminAPI} from "../../apis/CurationAPICalls.js";
import CurationCSS from "../adminkeyword/Curation.module.css";

function FilteringModify() {
    const dispatch = useDispatch();
    const type = useSelector(state => state.curation.type);
    const [groupForm, setGroupForm] = useState({
        title  : "",
        content: "",
        typeId: 0,
    });
    const navigate = useNavigate();
    const [form, setForm] = useState([]);
    const [filterings, setFilterings] = useState([]);
    const filtering = useSelector(state => state.filtering);
    const param = useParams();
    const [id, setId] = useState(1);


    // 맨 처음 불러오기
    useEffect(() => {
        dispatch(callFilteringGroupAPI({groupId: param.groupId}));
        dispatch(callCurationTypesForAdminAPI());
        setGroupForm({
            title: filtering.data.filteringGroup.title, content: filtering.data.filteringGroup.content, typeId:filtering.data.filteringGroup.typeId
        })
        const newFilters = filtering.data.filterings.map((filter, index) => ({
            id: id + index, value: filter.keyword || filter.videoId || '', isSaved: true
        }));

        setId(id + filtering.data.filterings.length);
        setFilterings([...filterings, ...newFilters]);
    }, []);


    const onChangeSelect = (e) => {
        console.log("e.target.value", e.target.value);
        setGroupForm({
            ...groupForm,
            typeId: e.target.value,
        });
    }

    const onChangeHandler = (e) => {
        setGroupForm({
            ...groupForm, [e.target.name]: e.target.value,
        });
    };
    const CreateFiltering = () => {
        if (filterings.length < 15) {
            setFilterings(prev => [...prev, {id: id, value: '', isSaved: false}]);
            setId(id + 1);
        } else {
            alert('더이상 추가할 수 없습니다');
        }
    }

    const onChangeHandler2 = (e) => {
        console.log(e.target.name, e.target.value);
        setForm({
            ...form, [e.target.name]: e.target.value,
        });
    };

    const deleteFiltering = (id) => {
        setFilterings(prev => prev.filter(filtering => filtering.id !== id));
    };

    const saveFiltering = (e, id) => {
        setFilterings(prev => prev.map(filtering => filtering.id === id ? {
            ...filtering, value: e.target.value, isSaved: true
        } : filtering));
    }

    const saveAll = async () => {

        try {

            const newFilterings = filterings.map(filtering => {
                const firstChar = filtering.value?.[0];
                if (!/^[가-힣ㄱ-ㅎㅏ-ㅣ]$/.test(firstChar)) {
                    return {
                        groupId: param.groupId,
                        videoId: filtering.value,
                        keyword: "",
                    };
                } else {
                    return {
                        groupId: param.groupId,
                        videoId: "",
                        keyword: filtering.value,
                    };
                }
            });

            const newFinal = {
                filteringGroup: {
                    groupId: param.groupId,
                    title: groupForm.title,
                    content: groupForm.content,
                    typeId: groupForm.typeId
                },
                filterings: newFilterings
            };

            dispatch(callFilteringGroupUpdateAPI({final:newFinal}));
            navigate(`/admin/filtering`);

        } catch (error) {
            console.error("Error in saveAll:", error);
        }
    }

    return (<div className={FListCSS.container}>
        <div className={FListCSS.fontContainer}>
            <input className={FListCSS.filteringTitle} onChange={onChangeHandler} type="text" name="title"
                   value={groupForm.title}/>
        </div>
        <hr className={FListCSS.filteringLine}/>
        <textarea className={FListCSS.filteringContent} onChange={onChangeHandler} name="content"
                  value={groupForm.content}/>
        <div className={FListCSS.typeDiv}>
            <p className={FListCSS.font3}>필터링 요소 수정</p>
            {/*타입 설정*/}
            <select onChange={onChangeSelect} defaultValue={groupForm.typeId} style={{"border": "none"}}
                    className={CurationCSS.filteringKeyword} value={groupForm.typeId}>
                <option value="0">None</option>
                {type?.map(cu => (
                    <option key={cu.typeId} value={cu.typeId}>
                        {cu.typeName}
                    </option>))}
            </select>
            {/*타입 설정*/}
        </div>
        <hr className={FListCSS.filteringLine}/>
        <div className={FListCSS.filteringDiv}>
            {filterings.map((filtering) => (<div className={FListCSS.filteringWrapper} key={filtering.id}>
                {filtering.isSaved ? (<p className={FListCSS.savedKeyword}>{filtering.value}</p>) : (
                    <input className={FListCSS.filteringInput} key={filtering.id} type="text"
                           placeholder="입력하세요"
                           name="value"
                           onChange={onChangeHandler2}
                           onKeyDown={(e) => {
                               if (e.key == 'Enter') {
                                   saveFiltering(e, filtering.id);
                               }
                           }}
                    />)}
                <button className={FListCSS.noneBt} type="button"
                        onClick={() => deleteFiltering(filtering.id)}>X
                </button>
            </div>))}
            <button className={FListCSS.redBt} onClick={CreateFiltering}>+</button>
        </div>
        <hr className={FListCSS.filteringLine}/>
        <div className={FListCSS.paging}>
            <p className={FListCSS.font2} onClick={saveAll}>수정완료</p>
        </div>
    </div>)
}

export default FilteringModify;
