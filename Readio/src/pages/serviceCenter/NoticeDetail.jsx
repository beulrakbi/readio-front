import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './NoticeDetail.module.css';
import Pagination from '../../components/board/common/Pagination';

function NoticeDetail() {
    const { noticeId } = useParams();
    const [noticeDetail, setNoticeDetail] = useState(null);
    const [relatedNotices, setRelatedNotices] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0); // 0부터 시작
    const noticesPerPage = 4; // 한 페이지에 보일 공지 개수
    const userId = sessionStorage.getItem('userId'); 
    const indexOfLastNotice = (currentPage + 1) * noticesPerPage;
    const indexOfFirstNotice = currentPage * noticesPerPage;
    const currentNotices = relatedNotices.slice(indexOfFirstNotice, indexOfLastNotice);

    const getNoticeStateKorean = (state) => {
        switch (state) {
            case 'TEMPORARY':
                return '단기';
            case 'URGENT':
                return '긴급';
            case 'CLOSED':
                return '종료';
            default:
                return state; // 혹시 모르는 값은 그대로 반환
        }
    };

    // 상세 공지 불러오기
    useEffect(() => {
        fetch(`http://localhost:8080/serviceCenter/notice/detail/${noticeId}`)
            .then(res => res.json())
            .then(data => {
                setNoticeDetail(data);
            })
            .catch(error => console.error('공지 상세 정보 불러오기 실패:', error));
    }, [noticeId]);

    // 관련 공지 목록 불러오기
    useEffect(() => {
        fetch('http://localhost:8080/serviceCenter/notice/list')
            .then(res => res.json())
            .then(data => {
                setRelatedNotices(data);
                setCurrentPage(0); // 데이터가 바뀌면 페이지 초기화
            })
            .catch(error => console.error('관련 공지 목록 불러오기 실패:', error));
    }, []);

    if (!noticeDetail) return <p>로딩 중...</p>;

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('링크가 복사되었습니다!');
        });
    };

    return (
        <div className={styles.bigContainer}>
            <p className={styles.sort}>공지사항</p>

            <div>
                <p className={styles.title}>{noticeDetail.noticeTitle}</p>
            </div>

            <div className={styles.line}></div>

            <div className={styles.nameBox}>
                <span className={styles.userId}>{noticeDetail.userId}</span>
                <span className={styles.role}>{noticeDetail.userRole}</span>
            </div>

            <div>
                <span className={styles.date}>
                    {noticeDetail.noticeCreateAt?.replace('T', ' ').substring(0, 16)}
                </span>
                <span className={styles.view}>조회 {noticeDetail.noticeView}</span>
            </div>

            <div className={styles.line2}></div>

            <div className={styles.contentBox}>
                <p>{noticeDetail.noticeContent || '공지 내용이 없습니다.'}</p>
            </div>

            <div className={styles.copyLink}>
                <button className={styles.btn} onClick={handleCopyLink}>링크 복사</button>
            </div>

            <div className={styles.line2}></div>

            <div className={styles.listBox}>
                <div className={styles.noticeBoard}>
                    <p>공지사항 게시판</p>
                </div>

                <div className={styles.list}>
                    <ul>
                        {currentNotices.map((notice) => (
                            <li
                                key={notice.noticeId}
                                onClick={() => navigate(`/notice/detail/${notice.noticeId}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className={styles.stateName}>[{getNoticeStateKorean(notice.noticeState)}]</span>
                                <span>{notice.noticeTitle}</span>
                                <span>{notice.userId}</span>
                                <span>{notice.noticeCreateAt?.substring(0, 10)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(relatedNotices.length / noticesPerPage)}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}

export default NoticeDetail;
