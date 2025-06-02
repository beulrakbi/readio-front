import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import FListCSS from './Filtering.module.css';
import {useDispatch} from "react-redux";
import {callFilteringGroupCreateAPI, callFilteringsCreateAPI} from "../../apis/FilteringAPICalls.js";

function FilteringCreate() {

    const dispatch = useDispatch();
    const [groupForm, setGroupForm] = useState({
        title  : "",
        content: "",
    });
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        console.log(e.target.name, e.target.value);
        setGroupForm({
            ...groupForm,
            [e.target.name]: e.target.value,
        });
    };

    // 필터링 추가 및 저장

    const [form, setForm] = useState([]);
    const [final, setFinal] = useState([{
        videoId: "",
        keyword: "",
    }]);
    const [filterings, setFilterings] = useState([]);
    const [id, setId] = useState(1);
    const createFiltering = () => {
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
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const deleteFiltering = (id) => {
        setFilterings(prev => prev.filter(filtering => filtering.id !== id));
    };

    const saveFiltering = (e, id) => {
        setFilterings(prev => prev.map(filtering =>
            filtering.id === id
                ? {...filtering, keyword: e.target.value, isSaved: true}
                : filtering
        ));
    }

    const saveAll = async () => {
        try {
            const result = await dispatch(callFilteringGroupCreateAPI({groupForm}));
            console.log("result", result);

            await new Promise(resolve => setTimeout(resolve, 500));

            if (result) {
                const groupId = result.data;
                const newFinal = filterings.map(filtering => {
                    const firstChar = filtering.keyword?.[0];

                    if (/^[a-zA-Z0-9]$/.test(firstChar)) {
                        return {
                            groupId: groupId,
                            videoId: filtering.keyword,
                            keyword: "",
                        };
                    } else {
                        return {
                            groupId: groupId,
                            videoId: "",
                            keyword: filtering.keyword,
                        };
                    }
                });

                setFinal(newFinal);
                await dispatch(callFilteringsCreateAPI({
                    groupId   : groupId,
                    filterings: newFinal
                }));

                navigate('/admin/filtering');
            }
        } catch (error) {
            console.error("Error in saveAll:", error);
        }
    };

    return (
        <div className={FListCSS.container}>
            <div className={FListCSS.fontContainer}>
                <input className={FListCSS.filteringTitle} onChange={onChangeHandler} type="text" name="title"
                       value={groupForm.title} placeholder="제목을 입력하세요"/>
            </div>
            <hr className={FListCSS.filteringLine}/>
            <textarea className={FListCSS.filteringContent} onChange={onChangeHandler} name="content"
                      value={groupForm.content} placeholder="내용을 입력하세요"/>
            <p className={FListCSS.font3}>필터링 요소 추가</p>
            <hr className={FListCSS.filteringLine}/>
            <div className={FListCSS.filteringDiv}>
                {filterings.map((filtering) => (
                    <div className={FListCSS.filteringWrapper} key={filtering.id}>
                        {filtering.isSaved ?
                            (
                                <p className={FListCSS.savedKeyword}>{filtering.keyword}</p>
                            )
                            :
                            (
                                <input className={FListCSS.filteringInput} key={filtering.id} type="text"
                                       placeholder="입력하세요"
                                       name="keyword"
                                    // value={form.keyword}
                                       onChange={onChangeHandler2}
                                       onKeyDown={(e) => {
                                           if (e.key == 'Enter') {
                                               saveFiltering(e, filtering.id);
                                           }
                                       }
                                       }
                                />
                            )
                        }
                        <button className={FListCSS.noneBt} type="button"
                                onClick={() => deleteFiltering(filtering.id)}>X
                        </button>
                    </div>
                ))}
                <button className={FListCSS.redBt} onClick={createFiltering}>+</button>
            </div>
            <hr className={FListCSS.filteringLine}/>
            <div className={FListCSS.paging}>
                <p className={FListCSS.font2} onClick={saveAll}>작성</p>
            </div>
        </div>
    )
}

export default FilteringCreate;