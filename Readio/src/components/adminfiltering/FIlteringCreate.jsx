import { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import FListCSS from './Filtering.module.css';
import {useDispatch, useSelector} from "react-redux";
import {callFilteringGroupCreateAPI} from "../../apis/FilteringAPICalls.js";

function FilteringCreate()
{

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const params = useParams();
    // const filteringGroups  = useSelector(state => state.filteringReducer);
    // const filteringGroupList = filteringGroups.data;

    const [form, setForm] = useState({
        title: "",
        content: "",
    });

    const onChangeHandler = (e) => {
        console.log(e.target.name, e.target.value);
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const SaveFilteringGroup = () => {
        console.log("[FilteringGroupCreate] SaveFilteringGroup Start!!");

        dispatch(
            callFilteringGroupCreateAPI({form})
        );

        // alert("필터링 그룹 등록이 완료되었습니다.");

        // navigate(`/admin/filtering/list`, { replace: true });
        // window.location.reload();

        console.log("[FilteringGroupCreate] SaveFilteringGroup End!!");
    };


    // useEffect(() => {
    //     dispatch(callFilteringGroupCreateAPI({
    //
    //     }))
    // }, []);



    const [filterings, setFilterings] = useState([]);
    const [id, setId] = useState(1);
    const CreateFiltering = () => {
        if (filterings.length < 15)
        {
            setFilterings(prev => [...prev, { id: id, value: '', isSaved: false }]);
            setId(id + 1);
        }
        else
        {
            alert('더이상 추가할 수 없습니다');
        }
    }

    const DeleteFiltering = (id) => {
        setFilterings(prev => prev.filter(filtering => filtering.id !== id));
    };

    const SaveFiltering = (e, id) => {
        setFilterings(prev => prev.map(filtering =>
                filtering.id === id
                ? { ...filtering, keyword: e.target.value, isSaved: true }
                : filtering
            )
        );
    }

    useEffect(() => {
        console.log('filterings 업데이트됨:', filterings);
    }, [filterings]);

    return (
        <div className={FListCSS.container}>
            <div className={FListCSS.fontContainer}>
            <input className={FListCSS.filteringTitle} onChange={onChangeHandler} type="text" name="title" value={form.title} placeholder="제목을 입력하세요"/>
            </div>
            <hr className={FListCSS.filteringLine}/>
            <textarea className={FListCSS.filteringContent} onChange={onChangeHandler} name="content" value={form.content} placeholder="내용을 입력하세요" />
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
                                <input className={FListCSS.filteringInput} key={filtering.id} type="text" placeholder="입력하세요"
                                    onKeyDown={(e) => {
                                            if (e.key == 'Enter')
                                            {
                                                SaveFiltering(e, filtering.id);
                                            }
                                        }
                                    }
                                />
                            )
                        }
                        <button className={FListCSS.noneBt} type="button" onClick={() => DeleteFiltering(filtering.id)}>X</button>
                    </div>
                ))}
            <button className={FListCSS.redBt} onClick={CreateFiltering}>+</button>
            </div>
            <hr className={FListCSS.filteringLine}/>
            <div className={FListCSS.paging}>
                <p className={FListCSS.font2} onClick={SaveFilteringGroup}>작성</p>
            </div>
        </div>
    )
}

export default FilteringCreate;