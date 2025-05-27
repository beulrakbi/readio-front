import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './QnaWriting.module.css';

function QnaWriting() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const { qnaId } = useParams(); // 수정 모드 여부 확인

    // 수정 모드일 때 기존 데이터 불러오기
    useEffect(() => {
        if (qnaId) {
            fetch(`http://localhost:8080/serviceCenter/qna/detail/${qnaId}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Q&A 조회 실패');
                    return res.json();
                })
                .then((data) => {
                    setTitle(data.qnaTitle || '');
                    setContent(data.qnaQuestion || '');
                })
                .catch((err) => {
                    alert('Q&A를 불러오는 중 오류가 발생했습니다.');
                    navigate('/qna');
                });
        }
    }, [qnaId, navigate]);

    // 등록/수정 제출
    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const url = qnaId
            ? `http://localhost:8080/serviceCenter/qna/update` // 예: 수정 엔드포인트
            : `http://localhost:8080/serviceCenter/qna/question`; // 등록 엔드포인트
        const method = qnaId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                qnaId: qnaId ? Number(qnaId) : 0, // 수정 시 ID 필요
                qnaTitle: title,
                qnaQuestion: content
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error('질문 등록/수정 실패');
                return res.text();
            })
            .then(msg => {
                alert(msg);
                navigate('/qna');
            })
            .catch(err => {
                console.error(err);
                alert('질문 등록/수정 중 오류가 발생했습니다.');
            });
    };

    const handleCancel = () => {
        navigate('/qna');
    };

    return (
        <div className={styles.bigContainer}>
            <div className={styles.smallHeader}>
                <span className={styles.smallHeaderElement}>Q&A 게시판</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.titleBox}>
                <input
                    type="text"
                    className={styles.textTitle}
                    placeholder="제목을 입력하세요."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className={styles.contentBox}>
                <textarea
                    className={styles.textAreaBox}
                    placeholder="내용을 입력하세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
            </div>
            <div className={styles.btnBox}>
                <button className={styles.btn} onClick={handleSubmit}>
                    {qnaId ? '수정' : '등록'}
                </button>
                <button className={styles.btn} onClick={handleCancel}>취소</button>
            </div>
        </div>
    );
}

export default QnaWriting;
