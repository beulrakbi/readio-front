import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useNavigate 추가
import styles from './AdminQnaDetail.module.css';

function AdminQnaDetail() {
    const { qnaId } = useParams();
    const [qna, setQna] = useState(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/serviceCenter/qna/detail/${qnaId}`);
                if (!response.ok) throw new Error('서버 오류');
                const data = await response.json();
                setQna(data);
            } catch (error) {
                console.error('QNA 상세 조회 실패:', error);
                alert('Q&A 정보를 불러오는 중 오류가 발생했습니다.');
                navigate('/admin/qna'); // 오류 시 목록 페이지로 이동
            }
        };
        fetchQnaDetail();
    }, [qnaId, navigate]);

    // 답변 삭제 핸들러 (AdminQnaDetail에 유지할 경우)
    const handleDeleteAnswer = async () => {
        const confirmed = window.confirm('정말로 이 답변을 삭제하시겠습니까?');
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:8080/serviceCenter/qna/Answer/delete', {
                method: 'PUT', // 백엔드 로직에 따라 DELETE 또는 PUT 사용
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰이 필요하다면 추가
                },
                body: JSON.stringify({
                    qnaId: qna.qnaId,
                    qnaAnswer: null, // 답변을 null로 설정하여 삭제
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`답변 삭제 실패: ${errorText}`);
            }
            alert('답변이 삭제되었습니다.');
            setQna({ ...qna, qnaAnswer: null }); // UI 업데이트
        } catch (error) {
            console.error('답변 삭제 오류:', error);
            alert(`답변 삭제 중 오류가 발생했습니다: ${error.message}`);
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

                {/* 답변 섹션 */}
                <div className={styles.answerBox}>
                    <div className={styles.smallHeader}>
                        <span className={styles.answerTitle}>답변</span>
                        <div>
                            {/* 답변이 있을 때만 삭제 버튼 표시 */}
                            {qna.qnaAnswer && (
                                <span className={styles.deleteBtn} onClick={handleDeleteAnswer}>
                                    삭제
                                </span>
                            )}
                            {/* 답변 작성/수정 버튼 */}
                            <span
                                className={styles.writeBtn}
                                onClick={() => navigate(`/admin/qna/answer/${qnaId}`)} // AdminQnaAnswer 페이지로 이동
                            >
                                {qna.qnaAnswer ? '답변 수정' : '답변 작성'}
                            </span>
                        </div>
                    </div>
                    <div className={styles.line2}></div>
                </div>

                {/* 작성된 답변 내용 표시 */}
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