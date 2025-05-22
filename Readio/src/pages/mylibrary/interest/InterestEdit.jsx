import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InterestEdit.module.css';

const InterestEditPage = () => {
    const navigate = useNavigate();

    const [allCategories, setAllCategories] = useState([]);
    const [allKeywords, setAllKeywords] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetch('/api/admin/interests/categories')
            .then(res => res.json())
            .then(data => setAllCategories(data.map(d => d.name)))
            .catch(err => console.error('카테고리 불러오기 실패', err));

        fetch('/api/admin/interests/keywords')
            .then(res => res.json())
            .then(data => setAllKeywords(data.map(d => d.name)))
            .catch(err => console.error('키워드 불러오기 실패', err));
    }, []);

    const toggle = (item, list, setList, max) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else if (list.length < max) {
            setList([...list, item]);
        }
    };

    const handleSave = () => {
        // 저장 로직 (선택한 카테고리와 키워드를 서버로 전송)
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
            navigate('/mylibrary/interest');
        }, 1000);
    };

    return (
        <div className={styles.InterestEditPageWrapper}>
            <div className={styles.wrapper}>
                <h2 className={styles.title} onClick={() => navigate('/mylibrary/interest')} style={{ cursor: 'pointer' }}>
                    &lt; 뒤로가기
                </h2>

                {/* 관심 분야 */}
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>관심 분야를 선택해 주세요</h3>
                    <p className={styles.description}>관심 분야를 기반으로 독서와 영상을 추천해 드릴게요!</p>
                    <div className={styles.box}>
                        <p className={styles.selectionCount}>{selectedCategories.length}개 선택 (최대 3개)</p>
                        <div className={styles.tagList}>
                            {allCategories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className={`${styles.tag} ${selectedCategories.includes(cat) ? styles.selected : ''}`}
                                    onClick={() => toggle(cat, selectedCategories, setSelectedCategories, 3)}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 관심 키워드 */}
                <div className={styles.block}>
                    <h3 className={styles.subtitle}>관심있는 키워드를 선택해 주세요</h3>
                    <p className={styles.description}>내게 꼭 맞는 영상과 책 그리고 관심분야가 맞는 회원을 추천해 드릴게요!</p>
                    <div className={styles.box}>
                        <p className={styles.selectionCount}>{selectedKeywords.length}개 선택 (최대 5개)</p>
                        <div className={styles.tagList}>
                            {allKeywords.map((kw, idx) => (
                                <span
                                    key={idx}
                                    className={`${styles.tag} ${selectedKeywords.includes(kw) ? styles.selected : ''}`}
                                    onClick={() => toggle(kw, selectedKeywords, setSelectedKeywords, 5)}
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <button className={styles.saveButton} onClick={handleSave}>완료</button>
                {showPopup && (
                    <div className={styles.showPopup}>
                        변경사항이 저장되었습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterestEditPage;
