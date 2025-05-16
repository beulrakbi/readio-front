import { useEffect, useState } from "react";
import { testBook } from "../../apis/BookAPI";
import bookmark2 from "../../assets/bookmark2.png";
import BookCSS from "./Book.module.css";
import VideosInBook from "./VideosInBook";

function Book()
{
    const [book, setBook] = useState([]);
    const [bookCover, setBookCover] = useState('');

    useEffect(() => {
        testBook()
        .then(data => {
            setBook(data.item[0]);
            console.log("book", book);
            if (book && book.cover) {
                setBookCover(book.cover.replace("coversum", "cover500"));
            }});
    },[book.cover])

        return (
            book &&
            <div className={BookCSS.bookPage}>
                <div className={BookCSS.bookSection}>
                    <div className={BookCSS.aladin}>
                        <p className={BookCSS.infoLight2}>도서 DB 제공 : 알라딘 인터넷서점(www.aladin.co.kr)</p>
                        <img className={BookCSS.bookCover} src={bookCover} alt={book.title}/>
                    </div>
                    <div className={BookCSS.bookInfo}>
                        <p className={BookCSS.bookTitle}>{book.title}</p>
                        <p className={BookCSS.reviewAndBookmark}>리뷰 15 북마크 3 <button className={BookCSS.buttonNone}><img className={BookCSS.bookmarkImg} src={bookmark2}/></button></p>
                        <p className={BookCSS.infoBold}>{book.author}</p>
                        <p className={BookCSS.infoBold}>{book.publisher} <p className={BookCSS.infoLight}>출판</p></p>
                        <p></p>
                        <p className={BookCSS.infoBold}>작품 소개</p>
                        <div className={BookCSS.bookDescription}>
                            <p className={BookCSS.infoLight}>{book.description}</p>
                            <button className={BookCSS.more}>더보기</button>
                        </div>
                        <p className={BookCSS.infoBold}>관련 영상</p>
                        <VideosInBook />
                    </div>
                </div>
            </div>
    )
}

export default Book;