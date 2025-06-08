import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate도 필요하면 추가

import styles from './AdminQnaDetail.module.css';

function AdminQnaDetail() {
    const { qnaId } = useParams();
    const [qna, setQna] = useState(null);
    const [showAnswerInput, setShowAnswerInput] = useState(false);
    const [answerText, setAnswerText] = useState(''); // 답변 텍스트 입력 상태

    // Q&A 상세 데이터 불러오기 및 answerText 초기화
    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/serviceCenter/qna/detail/${qnaId}`);
                if (!response.ok) throw new Error('서버 오류');
                const data = await response.json();
                setQna(data);
                // ✅ 중요: qna.qnaAnswer 값을 answerText 상태에 초기화
                setAnswerText(data.qnaAnswer || ''); // 답변이 없으면 빈 문자열로 초기화
            } catch (error) {
                console.error('QNA 상세 조회 실패:', error);
                alert('Q&A 정보를 불러오는 중 오류가 발생했습니다.');
                // navigate('/admin/qna'); // 오류 시 목록 페이지로 이동할 수 있음
            }
        };

        fetchQnaDetail();
    }, [qnaId]); // qnaId가 변경될 때마다 실행

    // "작성" 버튼 클릭 시 textarea 표시/숨기기 및 answerText 초기화 로직
    const handleToggleAnswerInput = () => {
        // textarea가 표시될 때 (true로 바뀔 때)만 answerText를 qna.qnaAnswer로 초기화
        if (!showAnswerInput) {
            setAnswerText(qna.qnaAnswer || '');
        }
        setShowAnswerInput(!showAnswerInput);
    };

    const handleWriteAnswer = async () => {
        if (!answerText.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/serviceCenter/qna/Answer', {
                method: 'PUT', // 답변 생성/수정 API가 PUT으로 처리된다고 가정
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰이 필요하다면 추가
                },
                body: JSON.stringify({
                    qnaId: qna.qnaId,
                    qnaAnswer: answerText,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`답변 ${qna.qnaAnswer ? '수정' : '등록'} 실패: ${errorText}`);
            }
            alert(`답변이 ${qna.qnaAnswer ? '수정' : '등록'}되었습니다.`);
            // 성공 후 qna 상태 업데이트 및 입력 필드 숨기기
            setQna({ ...qna, qnaAnswer: answerText });
            setShowAnswerInput(false);
            // answerText는 다음 작성/수정 시에 다시 qna.qnaAnswer로 초기화될 것이므로 여기서는 굳이 초기화할 필요 없음
        } catch (error) {
            console.error('답변 처리 오류:', error);
            alert(`답변 처리 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    const handleDeleteAnswer = async () => {
        const confirmed = window.confirm('정말로 이 답변을 삭제하시겠습니까?');
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:8080/serviceCenter/qna/Answer/delete', {
                method: 'PUT', // 백엔드에서 null로 업데이트하는 API가 PUT으로 처리된다고 가정
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    qnaId: qna.qnaId,
                    qnaAnswer: null, // 답변 내용을 null로 보냄
                }),
            });

            if (!response.ok) throw new Error('답변 삭제 실패');
            alert('답변이 삭제되었습니다.');
            setQna({ ...qna, qnaAnswer: null }); // UI에서 답변 제거
            setAnswerText(''); // textarea 내용도 초기화
            setShowAnswerInput(false); // 입력 필드 숨기기
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
                            {/* 답변이 있을 때만 삭제 버튼 표시 */}
                            {qna.qnaAnswer && (
                                <span className={styles.deleteBtn} onClick={handleDeleteAnswer}>
                                    삭제
                                </span>
                            )}
                            {/* "작성" 버튼에 통합된 핸들러 연결 */}
                            <span
                                className={styles.writeBtn}
                                onClick={handleToggleAnswerInput} // ✅ 새로운 핸들러 연결
                            >
                                {/* 답변 유무에 따라 버튼 텍스트 변경 */}
                                {showAnswerInput ? '취소' : (qna.qnaAnswer ? '수정' : '작성')}
                            </span>
                        </div>
                    </div>
                    <div className={styles.line2}></div>
                </div>

                {showAnswerInput && (
                    <div className={styles.answerInputArea}>
                        <textarea
                            className={styles.answerInput}
                            value={answerText} // ✅ answerText 상태 바인딩
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder={qna.qnaAnswer ? "답변 내용을 수정하세요." : "답변을 입력하세요."} // ✅ 플레이스홀더 동적 변경
                            rows={5}
                            style={{ resize: 'none' }}
                        />
                        <button className={styles.submitBtn} onClick={handleWriteAnswer}>
                            {qna.qnaAnswer ? '답변 수정' : '답변 등록'} {/* ✅ 버튼 텍스트 동적 변경 */}
                        </button>
                    </div>
                )}

                {/* 답변 입력 필드가 숨겨져 있고, 답변 내용이 있을 때만 기존 답변 표시 */}
                {!showAnswerInput && qna.qnaAnswer && (
                    <div className={styles.answerContent}>
                        <p className={styles.content}>
                            {qna.qnaAnswer}
                        </p>
                    </div>
                )}
                {/* 답변 입력 필드가 숨겨져 있고, 답변 내용이 없을 때만 "작성된 답변이 없습니다." 표시 */}
                {!showAnswerInput && !qna.qnaAnswer && (
                    <div className={styles.answerContent}>
                        <p className={styles.content}>
                            작성된 답변이 없습니다.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminQnaDetail;