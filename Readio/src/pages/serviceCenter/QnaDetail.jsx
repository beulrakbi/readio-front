import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './QnaDetail.module.css';

function QnaDetail() {
    const { qnaId } = useParams();
    const [qnaDetail, setQnaDetail] = useState(null);
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId'); // ✅ userId를 여기서 가져오고 있습니다.

    useEffect(() => {
        fetch(`http://localhost:8080/serviceCenter/qna/detail/${qnaId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('네트워크 응답이 올바르지 않습니다.');
                }
                return res.json();
            })
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

    const handleDeleteClick = () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            fetch(`http://localhost:8080/serviceCenter/qna/delete/${qnaId}`, {
                method: 'DELETE',
                headers: {
                    // 필요한 경우 JWT 토큰 등 인증 헤더 추가
                    // 현재 localStorage.getItem('accessToken')으로 되어 있는데,
                    // 다른 컴포넌트들에서 sessionStorage를 사용하고 있다면 일관성을 위해 sessionStorage로 변경하는 것을 고려할 수 있습니다.
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}` // ✅ sessionStorage로 변경 (선택 사항, 일관성 위함)
                },
            })
            .then(res => {
                if (res.ok) {
                    alert('게시글이 성공적으로 삭제되었습니다.');
                    navigate('/qna'); // 삭제 후 목록 페이지로 이동
                } else {
                    return res.text().then(text => { throw new Error(text) });
                }
            })
            .catch(error => {
                console.error('게시글 삭제 실패:', error);
                alert('게시글 삭제에 실패했습니다: ' + error.message);
            });
        }
    };

    // 현재 로그인한 사용자가 게시글 작성자인지 확인
    // ✅ currentUserId 대신 userId 사용
    const isAuthor = userId === qnaDetail.userId; 

    return (
        <div className={styles.bigContainer}>
            <div>
                <p className={styles.sort}>Q&A 게시판</p>
                <div className={styles.updateAndDelete}>
                    <p className={styles.title}>{qnaDetail.qnaTitle}</p>
                    {isAuthor && ( // 작성자일 경우에만 버튼 박스 렌더링
                        <div className={styles.btnBox}>
                            <span
                                className={styles.updateBtn}
                                onClick={handleUpdateClick}
                            >
                                수정
                            </span>
                            <span className={styles.slash}>/</span>
                            <span
                                className={styles.deleteBtn}
                                onClick={handleDeleteClick} // 삭제 버튼 클릭 핸들러 추가
                            >
                                삭제
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.nameBox}>
                <span className={styles.userId}>{qnaDetail.userId}</span> {/* 작성자 ID 표시 */}
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