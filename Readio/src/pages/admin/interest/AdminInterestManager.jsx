import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './AdminInterestManager.module.css';

// admin 경로에만 헤더 추가
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
    console.log("필터링 토큰 :", token)
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const AdminInterestSetting = () => {
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState('');

    const [keywords, setKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editType, setEditType] = useState(null); // 'category' | 'keyword'

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        // const token = localStorage.getItem("accessToken");

        fetch('/api/admin/interests/categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log("응답 상태 코드:", res.status);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => setCategories(data))
            .catch(err => console.error('카테고리 조회 실패:', err));

        fetch('/api/admin/interests/keywords', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                console.log("응답 상태 코드:", res.status);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => setKeywords(data))
            .catch(err => console.error('키워드 조회 실패:', err));
    }, []);

    const handleAddCategory = () => {
        const trimmed = categoryInput.trim();
        if (
            trimmed !== '' &&
            !categories.some(c => c.name === trimmed)
        ) {
            setCategories([...categories, { id: uuidv4(), name: trimmed }]);
            setCategoryInput('');
        } else if (trimmed !== '') {
            alert('이미 존재하는 관심분야입니다.');
        }
    };

    const handleAddKeyword = () => {
        const trimmed = keywordInput.trim();
        if (
            trimmed !== '' &&
            !keywords.some(k => k.name === trimmed)
        ) {
            setKeywords([...keywords, { id: uuidv4(), name: trimmed }]);
            setKeywordInput('');
        } else if (trimmed !== '') {
            alert('이미 존재하는 키워드입니다.');
        }
    };

    const handleRemoveCategory = async (id) => {
        const item = categories.find(c => c.id === id);
        if (!item || String(id).startsWith('temp-')) {
            setCategories(categories.filter(c => c.id !== id));
            return;
        }

        try {
            const res = await fetch(`/api/admin/interests/category/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader()      //5.30 토큰 추가
                }
            });
            if (!res.ok) throw new Error();
            setCategories(categories.filter(c => c.id !== id));
        } catch {
            alert('카테고리 삭제 중 오류 발생');
        }
    };

    const handleRemoveKeyword = async (id) => {
        const item = keywords.find(k => k.id === id);
        if (!item || String(id).startsWith('temp-')) {
            setKeywords(keywords.filter(k => k.id !== id));
            return;
        }

        try {
            const res = await fetch(`/api/admin/interests/keyword/${id}`, {
                method: 'DELETE',
                headers: {
                    ...getAuthHeader()      //5.30 토큰 추가
                }
            });
            if (!res.ok) throw new Error();
            setKeywords(keywords.filter(k => k.id !== id));
        } catch {
            alert('키워드 삭제 중 오류 발생');
        }
    };

    const startEditing = (id, type) => {
        setEditingId(id);
        setEditType(type);
    };

    const handleEditSave = async (id, newValue) => {
        if (!newValue.trim()) return;

        if (editType === 'category') {
            try {
                const res = await fetch(`/api/admin/interests/category/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()      //5.30 토큰 추가
                    },
                    body: JSON.stringify({ newName: newValue }),
                });
                if (!res.ok) throw new Error();
                setCategories(categories.map(c => c.id === id ? { ...c, name: newValue } : c));
            } catch {
                alert('카테고리 수정 실패');
            }
        } else if (editType === 'keyword') {
            try {
                const res = await fetch(`/api/admin/interests/keyword/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()      //5.30 토큰 추가
                    },
                    body: JSON.stringify({ newName: newValue }),
                });
                if (!res.ok) throw new Error();
                setKeywords(keywords.map(k => k.id === id ? { ...k, name: newValue } : k));
            } catch {
                alert('키워드 수정 실패');
            }
        }

        setEditingId(null);
        setEditType(null);
    };

    const handleSave = async () => {
        const payload = {
            categories: categories.map(c => c.name),
            keywords: keywords.map(k => k.name),
        };

        try {
            const res = await fetch('/api/admin/interests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()      //5.30 토큰 추가
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error();
            const result = await res.json();
            console.log('서버 응답:', result);
            alert('관심 정보가 성공적으로 저장되었습니다!');
        } catch {
            alert('저장에 실패했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>관심 정보 설정</h2>

            {/* 카테고리 */}
            <div className={styles.section}>
                <label className={styles.label}>관심분야 요소</label>
                <div className={styles.inputRow}>
                    {categories.map((cat) => (
                        <span key={cat.id} className={styles.tag}>
                            <span
                                contentEditable={editingId === cat.id && editType === 'category'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => startEditing(cat.id, 'category')}
                                onBlur={(e) => handleEditSave(cat.id, e.target.textContent)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleEditSave(cat.id, e.target.textContent);
                                    }
                                }}
                                style={{
                                    outline: 'none',
                                    cursor: editingId === cat.id ? 'text' : 'pointer',
                                    backgroundColor:
                                        editingId === cat.id && editType === 'category' ? '#B4B4B4' : 'transparent',
                                }}
                            >
                                {cat.name}
                            </span>
                            <button onClick={() => handleRemoveCategory(cat.id)} className={styles.removeBtn}>×</button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={categoryInput}
                        placeholder="입력하세요"
                        onChange={(e) => setCategoryInput(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={handleAddCategory} className={styles.addBtn}>+</button>
                </div>
            </div>

            <hr className={styles.divider} />

            {/* 키워드 */}
            <div className={styles.section}>
                <label className={styles.label}>관심 키워드 요소</label>
                <div className={styles.inputRow}>
                    {keywords.map((kw) => (
                        <span key={kw.id} className={styles.tag}>
                            <span
                                contentEditable={editingId === kw.id && editType === 'keyword'}
                                suppressContentEditableWarning={true}
                                onDoubleClick={() => startEditing(kw.id, 'keyword')}
                                onBlur={(e) => handleEditSave(kw.id, e.target.textContent)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleEditSave(kw.id, e.target.textContent);
                                    }
                                }}
                                style={{
                                    outline: 'none',
                                    cursor: editingId === kw.id ? 'text' : 'pointer'
                                }}
                            >
                                {kw.name}
                            </span>
                            <button onClick={() => handleRemoveKeyword(kw.id)} className={styles.removeBtn}>×</button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={keywordInput}
                        placeholder="입력하세요"
                        onChange={(e) => setKeywordInput(e.target.value)}
                        className={styles.input}
                    />
                    <button onClick={handleAddKeyword} className={styles.addBtn}>+</button>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.saveContainer}>
                <button className={styles.saveBtn} onClick={handleSave}>저장</button>
            </div>
        </div>
    );
};

export default AdminInterestSetting;
