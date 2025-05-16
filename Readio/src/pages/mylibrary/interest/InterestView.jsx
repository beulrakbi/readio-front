import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Interest.module.css';

const InterestViewPage = () => {
    const navigate = useNavigate();

    const selectedCategories = ['소설', '시/에세이'];
    const selectedKeywords = ['#습관', '#취미', '#인간관계'];

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title} onClick={()=>navigate('/mylibrary')} style={{ cursor: 'pointer' }}>
                &lt; 나의 관심사</h2>
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
            <button className={styles.editButton} onClick={() => navigate('/mylibrary/interest/edit')}>
                편집
            </button>
        </div>

    );
};

export default InterestViewPage;
