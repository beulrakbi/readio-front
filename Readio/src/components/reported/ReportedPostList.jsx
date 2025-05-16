import { Link } from "react-router-dom";
import searchIcon from '../../assets/search3.png';
import ReportedCSS from './Reported.module.css';

function ReportedPostList()
{
    return (

        <div className={ReportedCSS.container}>
            <div className={ReportedCSS.fontContainer}>
                <p className={ReportedCSS.font1}>신고된 포스트 관리</p>
                <div className={ReportedCSS.searchDiv}>
                    <form className={ReportedCSS.searchForm}>
                        <input type="text"
                            name="keyword"
                            placeholder="ID / 내용 검색"
                            className={ReportedCSS.searchInput}/>
                        <button className={ReportedCSS.searchBt}>
                            <img src={searchIcon} className={ReportedCSS.searchBt}/>
                        </button>
                    </form>
                </div>
            </div>
            <hr className={ReportedCSS.reportedLine} />
            <table className={ReportedCSS.reportedTable}>
                <thead className={ReportedCSS.reportedThead}>
                    <tr>
                        <td>번호</td>
                        <td>횟수</td>
                        <td>신고일</td>
                        <td>작성자</td>
                        <td>상태</td>
                        <td>포스트 제목</td>
                    </tr>
                </thead>
                <tbody className={ReportedCSS.reportedTbody}>
                    <tr>
                        <td>10</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>2025.04.01</td>
                        <td>user01</td>
                        <td>노출</td>
                        <td><Link to="/" className={ReportedCSS.link}>신고된 포스트 제목 1</Link></td>
                    </tr>
                </tbody>
            </table>
            <div className={ReportedCSS.radioBoxesDiv}>
                <div className={ReportedCSS.radioBoxDiv}>
                    <input className={ReportedCSS.radioBox} type="radio" id="1" name="test"/>
                    <input className={ReportedCSS.radioBox} type="radio" id="2" name="test"/>
                </div>
                <div className={ReportedCSS.radioBoxDiv}>
                    <label className={ReportedCSS.font2} for="1">숨김처리된 포스트만 보기</label>
                    <label className={ReportedCSS.font2} for="2">전체 보기</label>
                </div>
                <div className={ReportedCSS.paging2}>
                <p>1 2 3 4 5</p> 
                </div>
            </div>
        </div>
    )
        
}

export default ReportedPostList;