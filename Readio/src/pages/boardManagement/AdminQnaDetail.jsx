import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './AdminQnaDetail.module.css';

function AdminQnaDetail() {
    const { qnaId } = useParams();
    const [qna, setQna] = useState(null);
    const [showAnswerInput, setShowAnswerInput] = useState(false);
    const [answerText, setAnswerText] = useState('');

    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/serviceCenter/qna/detail/${qnaId}`);
                if (!response.ok) throw new Error('서버 오류');
                const data = await response.json();
                setQna(data);
            } catch (error) {
                console.error('QNA 상세 조회 실패:', error);
            }
        };

        fetchQnaDetail();
    }, [qnaId]);

    const handleWriteAnswer = async () => {
        try {
            const response = await fetch('http://localhost:8080/serviceCenter/qna/Answer', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    qnaId: qna.qnaId,
                    qnaAnswer: answerText,
                }),
            });

            if (!response.ok) throw new Error('답변 등록 실패');
            alert('답변이 등록되었습니다.');
            setQna({ ...qna, qnaAnswer: answerText });
            setShowAnswerInput(false);
            setAnswerText('');
        } catch (error) {
            console.error('답변 등록 오류:', error);
            alert('답변 등록 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteAnswer = async () => {
        const confirmed = window.confirm('정말로 이 답변을 삭제하시겠습니까?');
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:8080/serviceCenter/qna/Answer/delete', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    qnaId: qna.qnaId,
                    qnaAnswer: null,
                }),
            });

            if (!response.ok) throw new Error('답변 삭제 실패');
            alert('답변이 삭제되었습니다.');
            setQna({ ...qna, qnaAnswer: null });
        } catch (error) {
            console.error('답변 삭제 오류:', error);
            alert('답변 삭제 중 오류가 발생했습니다.');
        }
    };

    if (!qna) {
        return <div className={styles.main}><p>로딩 중...</p></div>;
    }

    return (
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>Q&A</span>
                </div>
                <div className={styles.line}></div>

                <div>
                    <p>{qna.qnaTitle}</p>
                    <div className={styles.whoWhen}>
                        <span className={styles.userName}>{qna.qnaWriter || '사용자'}</span>
                        <span className={styles.createdAt}>{new Date(qna.qnaCreateAt).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.line2}></div>
                </div>

                <div className={styles.question}>
                    <p>{qna.qnaQuestion}</p>
                </div>

                <div className={styles.answerBox}>
                    <div className={styles.smallHeader}>
                        <span className={styles.answerTitle}>답변</span>
                        <div>
                            <span className={styles.deleteBtn} onClick={handleDeleteAnswer}>
                                삭제
                            </span>
                            <span
                                className={styles.writeBtn}
                                onClick={() => setShowAnswerInput(!showAnswerInput)}
                            >
                                {showAnswerInput ? '취소' : '작성'}
                            </span>
                        </div>
                    </div>
                    <div className={styles.line2}></div>
                </div>

                {showAnswerInput && (
                    <div className={styles.answerInputArea}>
                        <textarea
                            className={styles.answerInput}
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder="답변을 입력하세요"
                            rows={5}
                            style={{ resize: 'none' }} // 크기 조정 비활성화
                        />
                        <button className={styles.submitBtn} onClick={handleWriteAnswer}>
                            답변 등록
                        </button>
                    </div>
                )}

                <div className={styles.answerContent}>
                    <p className={styles.content}>
                        {qna.qnaAnswer ? qna.qnaAnswer : '작성된 답변이 없습니다.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminQnaDetail;
