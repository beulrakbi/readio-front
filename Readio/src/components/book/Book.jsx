import {useEffect, useState} from "react";
import bookmark2 from "../../assets/bookmark2.png";
import BookCSS from "./Book.module.css";
import VideosInBook from "./VideosInBook";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {callBookAPI} from "../../apis/BookAPICalls.js";

function Book() {
    const [book, setBook] = useState([]);
    const [bookCover, setBookCover] = useState('');
    const param = useParams();
    const dispatch = useDispatch();
    // console.log("param", param.bookIsbn);

    useEffect(() => {

        const getBookInfo = async () => {
            const test = await dispatch(callBookAPI({bookIsbn: param.bookIsbn}));
            setBook(test);
        }
        if (book && book.bookCover) {
            setBookCover(book.bookCover.replace("coversum", "cover500"));
        }

        getBookInfo();
    }, [book.bookCover])

    return (book && <div className={BookCSS.bookPage}>
            <div className={BookCSS.bookSection}>
                <div className={BookCSS.aladin}>
                    <p className={BookCSS.infoLight2}>도서 DB 제공 : 알라딘 인터넷서점(www.aladin.co.kr)</p>
                    <img className={BookCSS.bookCover} src={bookCover} alt={book.bookTitle}/>
                </div>
                <div className={BookCSS.bookInfo}>
                    <p className={BookCSS.bookTitle}>{book.bookTitle}</p>
                    <p className={BookCSS.reviewAndBookmark}>리뷰 15 북마크 3 <button className={BookCSS.buttonNone}>
                        <img className={BookCSS.bookmarkImg} src={bookmark2}/></button></p>
                    <p className={BookCSS.infoBold}>{book.bookAuthor}</p>
                    <span className={BookCSS.infoBold}>{book.bookPublisher} <p className={BookCSS.infoLight}>출판</p></span>
                    <p className={BookCSS.infoBold}>작품 소개</p>
                    <div className={BookCSS.bookDescription}>
                        <p className={BookCSS.infoLight}>{book.bookDescription}</p>
                        <button className={BookCSS.more}>더보기</button>
                    </div>
                    <p className={BookCSS.infoBold}>관련 영상</p>
                    <VideosInBook keyword={book.bookTitle}/>
                </div>
            </div>
        </div>)
}

export default Book;