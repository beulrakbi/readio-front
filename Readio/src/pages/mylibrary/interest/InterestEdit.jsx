import { useEffect, useState } from 'react';
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
        const userId = sessionStorage.getItem("userId");          //5.30 변경_이상있으면 말해주세요
        const token = sessionStorage.getItem("accessToken");     //5.30 변경_이상있으면 말해주세요
        // const userId = localStorage.getItem("userId");
        // const token = localStorage.getItem("accessToken");

        if (!userId || !token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        fetch('/api/user/interests/categories')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setAllCategories(data))
            .catch(err => {
                console.error("Failed to fetch categories:", err);
            });

        fetch('/api/user/interests/keywords')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setAllKeywords(data))
            .catch(err => {
                console.error("Failed to fetch keywords:", err);
            });

        fetch(`/api/user/interests/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setSelectedCategories(data.categories.map(c => c.name));
                setSelectedKeywords(data.keywords.map(k => k.name));
            })
            .catch(err => console.error('유저 관심사 불러오기 실패', err));
    }, []);



    const toggle = (item, list, setList, max) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else if (list.length < max) {
            setList([...list, item]);
        }
    };

    const handleSave = () => {
        const userId = sessionStorage.getItem("userId");        // 5.30 변경테스트중
        const token = sessionStorage.getItem("accessToken");    // 5.30 변경테스트중
        // const userId = localStorage.getItem("userId");
        // const token = localStorage.getItem("accessToken");

        if (!userId || !token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        const payload = {
            userId: userId,
            categoryIds: selectedCategories
                .map(name => allCategories.find(c => c.name === name)?.id)
                .filter(id => id != null),
            keywordIds: selectedKeywords
                .map(name => allKeywords.find(k => k.name === name)?.id)
                .filter(id => id != null),
        };
        console.log("🟡 저장 payload:", payload);

        fetch('/api/user/interests', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (!res.ok) throw new Error('저장 실패');
                return res.json();
            })
            .then(() => {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/mylibrary/interest');
                }, 1000);
            })
            .catch(err => console.error('저장 에러:', err));
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
                                    className={`${styles.tag} ${selectedCategories.includes(cat.name) ? styles.selected : ''}`}
                                    onClick={() => toggle(cat.name, selectedCategories, setSelectedCategories, 3)}
                                >
        {cat.name}
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
                                    className={`${styles.tag} ${selectedKeywords.includes(kw.name) ? styles.selected : ''}`}
                                    onClick={() => toggle(kw.name, selectedKeywords, setSelectedKeywords, 5)}
                                >
        {kw.name}
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
