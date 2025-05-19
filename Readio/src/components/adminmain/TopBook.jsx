import AdminMainCSS from './adminmain.module.css';


function TopBook({book})
{
    return (
        <div className={AdminMainCSS.bookContainer}>
            <div className={AdminMainCSS.bookList}>
                <div className={AdminMainCSS.bookInnerContainer}>
                    <img className={AdminMainCSS.bookCover} src={book.cover} alt={book.title}/>
                    <div>
                        <p className={AdminMainCSS.bookFont}>책 이름</p>
                        <p className={AdminMainCSS.bookFont}>저자명</p>
                        <p className={AdminMainCSS.bookFont}>출간연도</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBook;