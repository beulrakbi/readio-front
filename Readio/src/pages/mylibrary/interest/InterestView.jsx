import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Interest.module.css';

const InterestViewPage = () => {
    const navigate = useNavigate();

    const { userId: paramUserId } = useParams();
    const currentUserId = sessionStorage.getItem("userId");          //5.30 변경_이상있으면 말해주세요
    // const currentUserId = localStorage.getItem("userId");        
    const targetUserId = paramUserId || currentUserId;

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    useEffect(() => {
        if (!currentUserId) {
            alert("로그인이 필요합니다.");
            return;
        }

        fetch(`/api/user/interests/${targetUserId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`          //5.30 변경_이상있으면 말해주세요
                // 'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setSelectedCategories(data.categories.map(c => c.name));
                setSelectedKeywords(data.keywords.map(k => k.name));
            })
            .catch(err => console.error('관심사 불러오기 실패', err));
    }, [targetUserId]);

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
                {targetUserId === currentUserId && (
                    <button className={styles.editButton} onClick={() => navigate('/mylibrary/interest/edit')}>
                        편집
                    </button>
                )}
            </div>
        </div>
    );
};

export default InterestViewPage;
