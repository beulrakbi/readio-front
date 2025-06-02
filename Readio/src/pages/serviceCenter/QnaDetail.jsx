import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './QnaDetail.module.css';

function QnaDetail() {
    const { qnaId } = useParams();
    const [qnaDetail, setQnaDetail] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        fetch(`http://localhost:8080/serviceCenter/qna/detail/${qnaId}`)
            .then(res => res.json())
            .then(data => {
                console.log('Qna Detail Data:', data);
                setQnaDetail(data);
            })
            .catch(error => console.error('Qna 상세 정보 불러오기 실패:', error));
    }, [qnaId]);

    if (!qnaDetail) return <p>로딩 중...</p>;

    const handleUpdateClick = () => {
        navigate(`/qna/writing/${qnaDetail.qnaId}`);
    };

    return (
        <div className={styles.bigContainer}>
            <div>
                <p className={styles.sort}>Q&A 게시판</p>
                <div className={styles.updateAndDelete}>
                    <p className={styles.title}>{qnaDetail.qnaTitle}</p>
                    <div className={styles.btnBox}>
                        <span
                            className={styles.updateBtn}
                            onClick={handleUpdateClick} 
                        >
                            수정
                        </span>
                        <span className={styles.slash}>/</span>
                        <span className={styles.deleteBtn}>삭제</span>
                    </div>
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.nameBox}>
                <span className={styles.userId}>{userId}</span>
                <span className={styles.role}>{qnaDetail.userRole}</span>
            </div>
            <div>
                <span className={styles.date}>
                    {qnaDetail.qnaCreateAt?.replace('T', ' ').substring(0, 16)}
                </span>
                <span className={styles.view}>조회 {qnaDetail.qnaView}</span>
            </div>
            <div className={styles.line2}></div>
            <div className={styles.contentBox}>
                <p>{qnaDetail.qnaQuestion || '질문 내용이 없습니다.'}</p>
            </div>
            <p className={styles.sort}>답변</p>
            <div className={styles.line2}></div>
            <div className={styles.qnaAnswer}>
                <p>{qnaDetail.qnaAnswer || '아직 답변이 없습니다.'}</p>
            </div>
        </div>
    );
}

export default QnaDetail;
