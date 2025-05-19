import React, { useState } from 'react';
import styles from './AdminInterestManager.module.css';

const AdminInterestSetting = () => {
    const [categories, setCategories] = useState(['관심분야1']);
    const [categoryInput, setCategoryInput] = useState('');

    const [keywords, setKeywords] = useState(['키워드1']);
    const [keywordInput, setKeywordInput] = useState('');

    const handleAddCategory = () => {
        if (categoryInput.trim() !== '') {
            setCategories([...categories, categoryInput.trim()]);
            setCategoryInput('');
        }
    };

    const handleRemoveCategory = (index) => {
        setCategories(categories.filter((_, i) => i !== index));
    };

    const handleAddKeyword = () => {
        if (keywordInput.trim() !== '') {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const handleRemoveKeyword = (index) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        console.log('저장된 관심분야:', categories);
        console.log('저장된 키워드:', keywords);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>관심 정보 설정</h2>

            <div className={styles.section}>
                <label className={styles.label}>관심분야 요소</label>
                <div className={styles.inputRow}>
                    {categories.map((cat, index) => (
                        <span key={index} className={styles.tag}>
              {cat}
                            <button onClick={() => handleRemoveCategory(index)} className={styles.removeBtn}>×</button>
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

            <div className={styles.section}>
                <label className={styles.label}>관심 키워드 요소</label>
                <div className={styles.inputRow}>
                    {keywords.map((kw, index) => (
                        <span key={index} className={styles.tag}>
              {kw}
                            <button onClick={() => handleRemoveKeyword(index)} className={styles.removeBtn}>×</button>
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
