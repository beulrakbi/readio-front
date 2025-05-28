import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Interest.module.css';

const InterestViewPage = () => {
    const navigate = useNavigate();

    const viewingUserId = 'test2';       // 내가 보고 있는 서재 주인
    const currentUserId = 'test2';       // 현재 로그인된 사용자

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    useEffect(() => {
        fetch(`/api/user/interests/${viewingUserId}`)
            .then(res => res.json())
            .then(data => {
                setSelectedCategories(data.categories.map(c => c.name));
                setSelectedKeywords(data.keywords.map(k => k.name));
            })
            .catch(err => console.error('관심사 불러오기 실패', err));
    }, [viewingUserId]);

    return (
        <div className={styles.InterestPageWrapper}>
            <div className={styles.wrapper}>
                <h2 className={styles.title} onClick={() => navigate('/mylibrary')} style={{ cursor: 'pointer' }}>
                    &lt; 나의 관심사
                </h2>

                <div className={styles.block}>
                    <h3 className={styles.subtitle}>좋아하는 분야</h3>
                    <div className={styles.tagList}>
                        {selectedCategories.map((cat, idx) => (
                            <span key={idx} className={styles.tag}>{cat}</span>
                        ))}
                    </div>
                </div>
                <hr className={styles.sectionDivider} />

                <div className={styles.block}>
                    <h3 className={styles.subtitle}>관심 키워드</h3>
                    <div className={styles.tagList}>
                        {selectedKeywords.map((kw, idx) => (
                            <span key={idx} className={styles.tag}>{kw}</span>
                        ))}
                    </div>
                </div>
                <hr className={styles.sectionDivider} />

                {/* 본인일 경우에만 편집 버튼 노출 */}
                {viewingUserId === currentUserId && (
                    <button className={styles.editButton} onClick={() => navigate('/mylibrary/interest/edit')}>
                        편집
                    </button>
                )}
            </div>
        </div>
    );
};

export default InterestViewPage;
