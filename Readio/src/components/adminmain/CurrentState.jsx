import { useEffect, useState } from 'react';
import AdminMainCSS from './adminmain.module.css';

function CurrentState()
{
    const [date, setDate] = useState('');

    
    useEffect(() => {
        let today = new Date();
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let day = ('0' + today.getDate()).slice(-2);
        let hours = ('0' + today.getHours()).slice(-2); 
        let minutes = ('0' + today.getMinutes()).slice(-2);
        let seconds = ('0' + today.getSeconds()).slice(-2); 

        let dateString = year + '-' + month  + '-' + day + ' ' + hours + ':' + minutes + ' 기준';
        
        setDate(dateString);
    },[]);

    return (
        <div className={AdminMainCSS.main}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>전체 현황</p> <p className={AdminMainCSS.font2}>{date}</p>
            </div>
            <hr className={AdminMainCSS.csLine}/>
            <div className={AdminMainCSS.csTableDiv}>
                <table className={AdminMainCSS.csTable}>
                    <tbody>

                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd}>
                            신규 가입
                        </td>
                        <td className={AdminMainCSS.csTableTd2}>123명</td>
                        <td className={AdminMainCSS.csTableTd3}></td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd}>
                            새로 신고된 리뷰
                        </td>
                        <td className={AdminMainCSS.csTableTd2}>
                            20건
                        </td>
                        <td className={AdminMainCSS.csTableTd3}></td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd}>
                            새로 신고된 포스트
                        </td>
                        <td className={AdminMainCSS.csTableTd2}>
                            15건
                        </td>
                        <td className={AdminMainCSS.csTableTd3}></td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd}>
                            새로 등록된 Q&A
                        </td>
                        <td className={AdminMainCSS.csTableTd2}>
                            32건
                        </td>
                        <td className={AdminMainCSS.csTableTd3}></td>
                    </tr>
                    <tr className={AdminMainCSS.csTableTr}>
                        <td className={AdminMainCSS.csTableTd}>
                            전체 유저 수
                        </td>
                        <td className={AdminMainCSS.csTableTd2}>
                            123412명
                        </td>
                        <td className={AdminMainCSS.csTableTd3}></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <hr className={AdminMainCSS.csLine}/>
        </div>
    )
}

export default CurrentState;
