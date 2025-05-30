import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './AdminInterestManager.module.css';

const AdminInterestSetting = () => {
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editType, setEditType] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        fetch('/api/admin/interests/categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
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
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => setKeywords(data))
            .catch(err => console.error('키워드 조회 실패:', err));
    }, []);

    const handleAddCategory = () => {
        const trimmed = categoryInput.trim();
        if (trimmed !== '' && !categories.some(c => c.name === trimmed)) {
            setCategories([...categories, { id: uuidv4(), name: trimmed }]);
            setCategoryInput('');
        } else if (trimmed !== '') {
            alert('이미 존재하는 관심분야입니다.');
        }
    };

    const handleAddKeyword = () => {
        const trimmed = keywordInput.trim();
        if (trimmed !== '' && !keywords.some(k => k.name === trimmed)) {
            setKeywords([...keywords, { id: uuidv4(), name: trimmed }]);
            setKeywordInput('');
        } else if (trimmed !== '') {
            alert('이미 존재하는 키워드입니다.');
        }
    };

    const handleRemoveCategory = async (id) => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`/api/admin/interests/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error();
            setCategories(categories.filter(c => c.id !== id));
        } catch {
            alert('카테고리 삭제 중 오류 발생');
        }
    };

    const handleRemoveKeyword = async (id) => {
        const token = localStorage.getItem("accessToken");
        try {
            const res = await fetch(`/api/admin/interests/keyword/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
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
        const trimmed = newValue.trim();
        if (!trimmed) return;

        const token = localStorage.getItem("accessToken");

        if (editType === 'category') {
            const exists = categories.some(c => c.name === trimmed && c.id !== id);
            if (exists) return alert('이미 존재하는 관심분야입니다.');

            try {
                const res = await fetch(`/api/admin/interests/category/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newName: trimmed }),
                });
                if (!res.ok) throw new Error();
                setCategories(categories.map(c => c.id === id ? { ...c, name: trimmed } : c));
            } catch {
                alert('카테고리 수정 실패');
            }
        } else if (editType === 'keyword') {
            const exists = keywords.some(k => k.name === trimmed && k.id !== id);
            if (exists) return alert('이미 존재하는 키워드입니다.');

            try {
                const res = await fetch(`/api/admin/interests/keyword/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newName: trimmed }),
                });
                if (!res.ok) throw new Error();
                setKeywords(keywords.map(k => k.id === id ? { ...k, name: trimmed } : k));
            } catch {
                alert('키워드 수정 실패');
            }
        }

        setEditingId(null);
        setEditType(null);
    };

    const handleSave = async () => {
        const token = localStorage.getItem("accessToken");
        const payload = {
            categories: categories.map(c => c.name),
            keywords: keywords.map(k => k.name),
        };

        try {
            const res = await fetch('/api/admin/interests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error();
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
                            {editingId === cat.id && editType === 'category' ? (
                                <input
                                    type="text"
                                    autoFocus
                                    defaultValue={cat.name}
                                    onBlur={(e) => handleEditSave(cat.id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleEditSave(cat.id, e.target.value);
                                        }
                                    }}
                                    className={styles.inputInline}
                                />
                            ) : (
                                <span
                                    onDoubleClick={() => startEditing(cat.id, 'category')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {cat.name}
                                </span>
                            )}
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
                            {editingId === kw.id && editType === 'keyword' ? (
                                <input
                                    type="text"
                                    autoFocus
                                    defaultValue={kw.name}
                                    onBlur={(e) => handleEditSave(kw.id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleEditSave(kw.id, e.target.value);
                                        }
                                    }}
                                    className={styles.inputInline}
                                />
                            ) : (
                                <span
                                    onDoubleClick={() => startEditing(kw.id, 'keyword')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {kw.name}
                                </span>
                            )}
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
