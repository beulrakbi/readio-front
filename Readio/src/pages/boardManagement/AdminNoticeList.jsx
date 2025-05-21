import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/search.png';
import styles from './AdminNoticeList.module.css';

function AdminNoticeList() {
    const [notices, setNotices] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const navigate = useNavigate();

    // 공지사항 리스트 가져오기
    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await fetch('http://localhost:8080/serviceCenter/notice/list');
            if (!response.ok) throw new Error('서버 오류');
            const data = await response.json();
            setNotices(data);
        } catch (error) {
            console.error('공지사항을 불러오는데 실패했습니다:', error);
        }
    };

    // 체크박스 선택/해제
    const handleCheckboxChange = (noticeId) => {
        setSelectedIds((prev) => {
            const updated = prev.includes(noticeId)
                ? prev.filter((id) => id !== noticeId)
                : [...prev, noticeId];
            setIsAllSelected(updated.length === notices.length);
            return updated;
        });
    };

    // 전체 선택/해제
    const handleAllCheckboxChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
            setIsAllSelected(false);
        } else {
            const allIds = notices.map((notice) => notice.noticeId);
            setSelectedIds(allIds);
            setIsAllSelected(true);
        }
    };

    // 선택 삭제
    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            alert('삭제할 공지사항을 선택해주세요.');
            return;
        }
        if (!window.confirm('선택한 공지사항을 삭제하시겠습니까?')) return;

        try {
            for (const id of selectedIds) {
                await fetch(`http://localhost:8080/serviceCenter/notice/delete/${id}`, {
                    method: 'DELETE',
                });
            }
            alert('삭제가 완료되었습니다.');
            setSelectedIds([]);
            setIsAllSelected(false);
            fetchNotices();
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    // 제목 클릭 시 수정 페이지 이동
    const handleTitleClick = (noticeId) => {
        navigate(`/admin/notice/edit/${noticeId}`);
    };

    return (
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>공지사항</span>
                    <div>
                        <button className={styles.writing}>
                            <NavLink to="/admin/notice/writing" className={styles.titlecolor}>글쓰기</NavLink>
                        </button>
                        <span className={styles.slash}>/</span>
                        <button className={styles.delete} onClick={handleDelete}>삭제</button>
                    </div>
                </div>

                <div className={styles.line}></div>

                <div className={styles.tableBox}>
                    <table className={styles.noticeTable}>
                        <thead>
                            <tr>
                                <th><input type="checkbox" checked={isAllSelected} onChange={handleAllCheckboxChange} /></th>
                                <th>번호</th>
                                <th>상태</th>
                                <th className={styles.titleSize}>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', paddingTop: '180px' }}>
                                        등록된 공지사항이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                notices.map((notice) => (
                                    <tr key={notice.noticeId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(notice.noticeId)}
                                                onChange={() => handleCheckboxChange(notice.noticeId)}
                                            />
                                        </td>
                                        <td>{notice.noticeId}</td>
                                        <td>{notice.noticeState === 'TEMPORARY' ? '단기' :
                                             notice.noticeState === 'URGENT' ? '긴급' : '종료'}</td>
                                        <td className={styles.titleCell}>
                                            <span
                                                onClick={() => handleTitleClick(notice.noticeId)}
                                                style={{ cursor: 'pointer', color: 'black', textDecoration: 'none' }}
                                            >
                                            {notice.noticeTitle}
                                            </span>
                                        </td>
                                        <td>관리자</td>
                                        <td>{new Date(notice.noticeCreateAt).toLocaleDateString()}</td>
                                        <td>{notice.noticeView}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className={styles.mcontainer}>
                    <div className={styles.textcontainer}>
                        <input className={styles.textbox} type="text" placeholder="검색어를 입력해주세요." />
                        <button className={styles.btn}><img src={searchIcon} alt="검색" /></button>
                    </div>
                    <div className={styles.pagingbox}>
                        <p className={styles.num}>1 2 3 4 5</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminNoticeList;
