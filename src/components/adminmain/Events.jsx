import { Link } from 'react-router-dom';
import AdminMainCSS from './adminmain.module.css';

function Events()
{
   
    return (
        <div className={AdminMainCSS.main}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>소식</p> <Link to="/" className={AdminMainCSS.linkFont}>더보기</Link>
            </div>
            <hr className={AdminMainCSS.csLine}/>
            <div className={AdminMainCSS.csTableDiv}>
                <table className={AdminMainCSS.csTable}>
                    <tbody>

                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd}>
                            한강의 신작 산문집 &lt;빛과 실&gt; 출간 이벤트 안내
                        </td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd4}>
                            [북펀드] 다시 피는 오월: 5.18 앤솔로지
                        </td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd4}>
                            &lt;줍는 순간&gt; 친필 사인본 + 코퍼 리드 색연필 6종 세트
                        </td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd4}>
                            &lt;나태주의 풀꽃 인생수업&gt; 초판 한정, 응원 글귀 메시지 카드
                        </td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd4}>
                            &lt;통섭&gt; 출간 20주년 기념, 한국진화학회 미니 심포지엄 (5...
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <hr className={AdminMainCSS.csLine}/>
        </div>
    )
}

export default Events;
