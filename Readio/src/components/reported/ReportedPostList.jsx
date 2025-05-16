import { Link } from "react-router-dom";
import ReportedCSS from './Reported.module.css';

function ReportedPostList()
{
        <div className={ReportedCSS.container}>
            <div className={ReportedCSS.fontContainer}>
                <p className={ReportedCSS.font1}>신고된 리뷰 관리</p>
                <p className={ReportedCSS.font2}><Link to="/admin/filtering/create" className={FListCSS.link}>필터링 추가</Link></p>
            </div>
            <hr className={ReportedCSS.filteringLine} />
            <table className={ReportedCSS.filteringTable}>
                <thead className={ReportedCSS.filteringThead}>
                    <tr>
                        <td>번호</td>
                        <td>횟수</td>
                        <td>신고일</td>
                        <td>작성자</td>
                        <td>상태</td>
                        <td>리뷰내용</td>
                    </tr>
                </thead>
                <tbody className={ReportedCSS.filteringTbody}>
                    <tr>
                        <td>10</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>불량리뷰내용ㄴㅁㅇㅁㄴㅇ</Link></td>
                    </tr>
                </tbody>
            </table>
            <div className={ReportedCSS.paging}>
                <p>1 2 3 4 5</p> 
            </div>
        </div>
}

export default ReportedPostList;
