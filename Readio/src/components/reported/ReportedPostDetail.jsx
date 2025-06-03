import {Link, useParams} from 'react-router-dom';
import ReportedCSS from './Reported.module.css';



function ReportedPostDetail()
{
    const param = useParams();
    console.log("param", param);


    return (
        <div className={ReportedCSS.container}>
            <div className={ReportedCSS.fontContainer}>
                <p className={ReportedCSS.font1}>신고된 포스트 제목 1</p>
                <p className={ReportedCSS.font3} onClick={() => confirm('숨김처리 하시겠습니까?')}>숨김</p>
            </div>
            <hr className={ReportedCSS.reportedLine} />
            <div className={ReportedCSS.reportedContent}>
                <table className={ReportedCSS.reportedContentTable}>
                    <tbody>
                        <tr>
                            <td>작성일</td>
                            <td>25.04.01</td>
                        </tr>
                        <tr>
                            <td>최근 신고일</td>
                            <td>25.04.02</td>
                        </tr>
                        <tr>
                            <td>신고된 횟수</td>
                            <td>4건</td>
                        </tr>
                        <tr>
                            <td>처리 상태</td>
                            <td>노출</td>
                        </tr>
                        <tr>
                            <td>포스트 작성 위치</td>
                            <td>https://readio.com/book/asdfasdf</td>
                        </tr>
                        <tr>
                            <td>내용</td>
                        </tr>
                    </tbody>
                </table>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti quas minima, laboriosam quisquam expedita quae enim quos voluptatem amet porro aspernatur ratione optio cumque commodi autem deserunt quod rem eius. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus voluptatem, dolor earum recusandae commodi reprehenderit corporis. Voluptates vitae cupiditate unde dolores, tenetur, illo ipsum perspiciatis minima cumque, nobis dolor. Expedita!</p>
            </div>
            <hr className={ReportedCSS.reportedLine} />
            <div className={ReportedCSS.paging}>
                <Link className={ReportedCSS.link} to="/admin/reported/post/list"><p className={ReportedCSS.font2}>뒤로가기</p></Link>
            </div>
        </div>

    )
}

export default ReportedPostDetail;