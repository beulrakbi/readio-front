import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './InterestEdit.module.css';

const ALL_CATEGORIES = ['소설', '비즈니스/경제', '인문학', '어린이', '예술', '요리/생활', '종교/철학', '과학', '외국어/어학'];
const ALL_KEYWORDS = ['마케팅', '위로', '육아', '글쓰기', '습관', '뇌과학', '인관관계', '취미', '사랑', '심리', 'SF', '영어', '교양철학', '추리', '동화', '주식'];

const InterestEditPage = () => {
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const toggle = (item, list, setList, max) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else if (list.length < max) {
            setList([...list, item]);
        }
    };

    const handleSave = () => {
        // 저장 로직 넣을 곳 (API 요청 등)
        setShowPopup(true); // 알림 보여주기
        setTimeout(() => {
            setShowPopup(false);
            navigate('/mylibrary/interest');
        }, 1000);
    };


    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title} onClick={()=>navigate('/mylibrary/interest')} style={{ cursor: 'pointer' }}>
                &lt; 뒤로가기</h2>
            {/* 관심 분야 */}
            <div className={styles.block}>
                <h3 className={styles.subtitle}>관심 분야를 선택해 주세요</h3>
                <p className={styles.description}>관심 분야를 기반으로 독서와 영상을 추천해 드릴게요!</p>
                <div className={styles.box}>
                    <p className={styles.selectionCount}>{selectedCategories.length}개 선택 (최대 3개)</p>
                    <div className={styles.tagList}>
                        {ALL_CATEGORIES.map((cat, idx) => (
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
                        {ALL_KEYWORDS.map((kw, idx) => (
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
    );
};

export default InterestEditPage;
