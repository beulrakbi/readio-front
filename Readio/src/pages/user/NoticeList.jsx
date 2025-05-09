import './NoticeList.css';

function NoticeList(){
    return(
        <>
        <div className="bigContainer">
            <div className="smallHeader">
                <span className="smallHeaderElement">공지사항 게시판</span>
                <div>
                    <button className="writing"> 글쓰기 </button>
                    <span className="slash">/</span>
                    <button className="writing">내가 쓴 글</button>
                </div>
            </div>
            <div className="line"></div>
            <ul className="board">
                <li className='boardLi'>
                    <span>게시글 번호</span>
                    <span>제목</span>
                    <div className='boardLi2'>
                        <span>작성자</span>
                        <span>작성일</span>
                        <span>조회수</span>
                    </div>
                </li>
                <li className='postLi'>
                    <span>0001</span>
                    <div className='postContext'>
                        <span>홍창기 안타 안타 날려 홍창기~ 홍창기 안타 날려버려라~</span>
                    </div>
                    <div className='postLi2'>
                        <span>user1</span>
                        <span>2025/05/03</span>
                        <span>1</span>
                    </div>
                </li>
                <li className='postLi'>
                    <span>0001</span>
                    <div className='postContext'>
                        <span>홍창기 안타 안타 날려 홍창기~ 홍창기 안타 날려버려라~</span>
                    </div>
                    <div className='postLi2'>
                        <span>user1</span>
                        <span>2025/05/03</span>
                        <span>1</span>
                    </div>
                </li>
                <li className='postLi'>
                    <span>0001</span>
                    <div className='postContext'>
                        <span>홍창기 안타 안타 날려 홍창기~ 홍창기 안타 날려버려라~</span>
                    </div>
                    <div className='postLi2'>
                        <span>user1</span>
                        <span>2025/05/03</span>
                        <span>1</span>
                    </div>
                </li>
                <li className='postLi'>
                    <span>0001</span>
                    <div className='postContext'>
                        <span>홍창기 안타 안타 날려 홍창기~ 홍창기 안타 날려버려라~</span>
                    </div>
                    <div className='postLi2'>
                        <span>user1</span>
                        <span>2025/05/03</span>
                        <span>1</span>
                    </div>
                </li><li className='postLi'>
                    <span>0001</span>
                    <div className='postContext'>
                        <span>홍창기 안타 안타 날려 홍창기~ 홍창기 안타 날려버려라~</span>
                    </div>
                    <div className='postLi2'>
                        <span>user1</span>
                        <span>2025/05/03</span>
                        <span>1</span>
                    </div>
                </li>
            </ul>
            <div className='mcontainer'>
                <div className='textcontainer'>
                <input className='textbox' type="text" placeholder='검색어를 입력해주세요.'/>
                <button className='btn'>클릭</button>
                </div>
                <div className='pagingbox'>
                    <p className='num'>1 2 3 4 5</p>
                </div>
            </div>
        </div>
        </>
    )
}
export default NoticeList;

