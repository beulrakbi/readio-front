import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AdminFaqWriting.module.css';

function AdminFaqWriting() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const { faqId } = useParams();
 

    // 토큰
    const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken'); // 5/30 변경 테스트중
    // const token = localStorage.getItem('accessToken'); // Login.jsx에서 저장한 토큰 키 이름과 일치하는지 확인!
    console.log("faq 토큰 :",  token)
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

    // 수정 모드일 경우 기존 데이터 불러오기
    useEffect(() => {
        if (faqId) {
            fetch(`http://localhost:8080/serviceCenter/faq/detail/${faqId}`,{
                method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                      ...getAuthHeader()

            },
            })

                .then((res) => {
                    if (!res.ok) throw new Error('FAQ 조회 실패');
                    return res.json();
                })
                .then((data) => {
                    setTitle(data.faqTitle || '');
                    setContent(data.faqContent || '');
                })
                .catch((err) => {
                    alert('FAQ를 불러오는 중 오류가 발생했습니다.');
                    navigate('/admin/faq');
                });
        }
    }, [faqId, navigate]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const data = {
            faqId: faqId ? Number(faqId) : 0,
            faqTitle: title,
            faqContent: content
        };

        try {
            const url = faqId
                ? 'http://localhost:8080/serviceCenter/faq/update'
                : 'http://localhost:8080/serviceCenter/faq/write';

            const method = faqId ? 'PUT' : 'POST';


            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert(`FAQ가 성공적으로 ${faqId ? '수정' : '등록'}되었습니다.`);
                navigate('/admin/faq');
            } else {
                alert(`FAQ ${faqId ? '수정' : '등록'}에 실패했습니다.`);
            }
        } catch (error) {
            console.error('서버 오류 발생:', error);
            alert('서버 오류로 처리에 실패했습니다.');
        }
    };

    const handleCancel = () => {
        if (window.confirm('작성을 취소하시겠습니까?')) {
            navigate('/admin/faq');
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>FAQ {faqId ? '수정' : '작성'}</span>
                </div>

                <div className={styles.line}></div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        className={styles.titleInput}
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <textarea
                    className={styles.textarea}
                    placeholder="내용을 입력해주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className={styles.bottom}>
                    <div className={styles.actionButtons}>
                        <button className={styles.submit} onClick={handleSubmit}>
                            {faqId ? '수정' : '등록'}
                        </button>
                        <button className={styles.cancel} onClick={handleCancel}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminFaqWriting;
