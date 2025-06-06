import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminMainCSS from './adminmain.module.css';

function CurrentState() {
    const [date, setDate] = useState('');
    const [userCount, setUserCount] = useState(null);
    const [monthlyCount, setMonthlyCount] = useState(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("accessToken");

    // 전체 유저 수 가져오기
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
                setUserCount(0);
            });
    }, []);

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
                            <td className={AdminMainCSS.csTableTd}>새로 등록된 Q&A</td>
                            <td className={AdminMainCSS.csTableTd2}>32건</td>
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