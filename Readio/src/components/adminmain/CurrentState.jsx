import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminMainCSS from './adminmain.module.css';

function CurrentState() {
    const [date, setDate] = useState('');
    const [userCount, setUserCount] = useState(null);
    // 새로 추가: 답변 없는 Q&A 수를 저장할 state
    const [unansweredQnaCount, setUnansweredQnaCount] = useState(null);
    const [monthlyCount, setMonthlyCount] = useState(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("accessToken");

    // 전체 회원 수 조회 (기존 코드)
    useEffect(() => {
        fetch("http://localhost:8080/admin/user-count", {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('서버 오류 발생');
                return res.json();
            })
            .then(data => {
                setUserCount(data);
            })
            .catch(err => {
                console.error("회원 수 조회 실패:", err);
                setUserCount(0); // 또는 '에러' 등으로 표시
            });
    },
        [token]); // 의존성 배열에 token 추가

    // 새로 추가: 답변 없는 Q&A 수 조회
    useEffect(() => {
        fetch("http://localhost:8080/serviceCenter/admin/qna/unanswered-count", { // 백엔드에 만든 새 API 엔드포인트
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}` ,
            }
        })
            .then(res => {
                if (!res.ok) {
                    // 403 Forbidden 에러 처리 (관리자 권한 없는 경우)
                    if (res.status === 403) {
                        console.error("Q&A 수 조회 실패: 관리자 권한이 없습니다.");
                        // 사용자에게 알림 또는 다른 페이지로 리다이렉트
                        // navigate('/login'); // 예시
                        return Promise.reject(new Error('관리자 권한이 없습니다.'));
                    }
                    throw new Error('Q&A 서버 오류 발생');
                }
                return res.json();
            })
            .then(data => {
                // 백엔드 응답 형식에 따라 data.unansweredCount로 접근
                setUnansweredQnaCount(data.unansweredCount);
                console.log("답변 없는 Q&A 수:", data.unansweredCount);
            })
            .catch(err => {
                console.error("답변 없는 Q&A 수 조회 실패:", err);
                setUnansweredQnaCount(0); // 에러 발생 시 0 또는 '에러' 등으로 표시
            });
    }, [token]); // token이 변경될 때 다시 호출되도록 의존성 배열에 token 추가


    // 이번 달 가입자 수 가져오기
    useEffect(() => {
        axios.get("http://localhost:8080/admin/monthly-count", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setMonthlyCount(res.data);
            })
            .catch(err => {
                console.error('신규 가입자 수 조회 실패:', err);
                setMonthlyCount(0);
            });
    }, []);

    // 현재 날짜 설정
    useEffect(() => {
        const today = new Date();
        const formatted = today.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        setDate(`${formatted} 기준`);
    }, []);

    return (
        <div className={AdminMainCSS.main}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>전체 현황</p>
                <p className={AdminMainCSS.font2}>{date}</p>
            </div>
            <hr className={AdminMainCSS.csLine} />
            <div className={AdminMainCSS.csTableDiv}>
                <table className={AdminMainCSS.csTable}>
                    <tbody>
                        <tr className={AdminMainCSS.csTableTr}>
                            <td className={AdminMainCSS.csTableTd}>신규 가입</td>
                            <td className={AdminMainCSS.csTableTd2}>
                                {monthlyCount !== null ? `${monthlyCount}명` : '로딩 중...'}
                            </td>
                            <td className={AdminMainCSS.csTableTd3}></td>
                        </tr>
                        <tr className={AdminMainCSS.csTableTr}>
                            <td className={AdminMainCSS.csTableTd}>새로 신고된 리뷰</td>
                            <td className={AdminMainCSS.csTableTd2}>20건</td>
                            <td className={AdminMainCSS.csTableTd3}></td>
                        </tr>
                        <tr className={AdminMainCSS.csTableTr}>
                            <td className={AdminMainCSS.csTableTd}>새로 신고된 포스트</td>
                            <td className={AdminMainCSS.csTableTd2}>15건</td>
                            <td className={AdminMainCSS.csTableTd3}></td>
                        </tr>
                        <tr className={AdminMainCSS.csTableTr}>
                            <td className={AdminMainCSS.csTableTd}>
                                새로 등록된 Q&A
                            </td>
                            <td className={AdminMainCSS.csTableTd2}>
                                {unansweredQnaCount !== null ? `${unansweredQnaCount}건` : '로딩 중...'} {/* 수정된 부분 */}
                            </td>
                            <td className={AdminMainCSS.csTableTd3}></td>
                        </tr>
                        <tr className={AdminMainCSS.csTableTr}>
                            <td className={AdminMainCSS.csTableTd}>전체 유저 수</td>
                            <td className={AdminMainCSS.csTableTd2}
                                onClick={() => navigate('/admin/users/list')}>
                                {userCount !== null ? `${userCount}명` : '로딩 중...'}
                            </td>
                            <td className={AdminMainCSS.csTableTd3}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr className={AdminMainCSS.csLine} />
        </div>
    );
}

export default CurrentState;