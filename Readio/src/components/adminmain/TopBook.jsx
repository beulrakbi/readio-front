import AdminMainCSS from './adminmain.module.css';

function TopBook({ book }) {
    return (
        <div className={AdminMainCSS.bookContainer}>
            <div className={AdminMainCSS.bookList}>
                <div className={AdminMainCSS.bookInnerContainer}>
                    <img
                        className={AdminMainCSS.bookCover}
                        src={book.thumbnail}
                        alt={book.title}
                    />
                    <div>
                        <p className={AdminMainCSS.bookFont}>{book.title || "제목 없음"}</p>
                        <p className={AdminMainCSS.bookFont}>{book.source || "저자 정보 없음"}</p>
                        <p className={AdminMainCSS.bookFont}>
                            {book.pubDate ? book.pubDate.split('-')[0] : "출간연도 없음"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopBook;
