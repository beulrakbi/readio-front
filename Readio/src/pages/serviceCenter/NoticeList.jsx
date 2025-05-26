import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from '../../components/board/common/Pagination';
import Search from '../../components/board/common/search';
import styles from './NoticeList.module.css';

function NoticeList() {
  const [noticeList, setNoticeList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');

  // 리스트 불러오기
  const fetchNoticeList = () => {
    let url = `http://localhost:8080/serviceCenter/notice/list/paging?page=${page}&size=7`;
    if (keyword.trim() !== '') {
      url = `http://localhost:8080/serviceCenter/notice/search?keyword=${keyword}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (keyword.trim() === '') {
          setNoticeList(data.content);
          setTotalPages(data.totalPages);
        } else {
          setNoticeList(data);
          setTotalPages(1);
        }
      })
      .catch(error => console.error('공지사항 리스트 불러오기 실패:', error));
  };

  useEffect(() => {
    fetchNoticeList();
  }, [page, keyword]);

  // 검색 핸들러
  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setPage(0); // 검색하면 페이지 0으로 초기화
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className={styles.bigContainer}>
      <div className={styles.smallHeader}>
        <span className={styles.smallHeaderElement}>공지사항 게시판</span>
      </div>
      <div className={styles.line}></div>
      <ul className={styles.board}>
        <li className={styles.boardLi}>
          <span>게시글 번호</span>
          <span>제목</span>
          <div className={styles.boardLi2}>
            <span>작성자</span>
            <span>작성일</span>
            <span>조회수</span>
          </div>
        </li>
        {noticeList.length === 0 ? (
          <li className={styles.postLi}>게시글이 없습니다.</li>
        ) : (
          noticeList.map((notice) => (
            <li key={notice.noticeId} className={styles.postLi}>
              <span>{notice.noticeId}</span>
              <div className={styles.postContext}>
                <span>
                  <NavLink
                    to={`/notice/detail/${notice.noticeId}`}
                    className={styles.titlecolor}
                  >
                    {notice.noticeTitle}
                  </NavLink>
                </span>
              </div>
              <div className={styles.postLi2}>
                <span>{notice.userId}</span>
                <span>{notice.noticeCreateAt ? notice.noticeCreateAt.split('T')[0] : ''}</span>
                <span>{notice.noticeView}</span>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className={styles.mcontainer}>
        <Search onSearch={handleSearch} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default NoticeList;
