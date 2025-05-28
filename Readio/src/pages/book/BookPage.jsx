// bookPage는 책 상세페이지이므로 

import Book from "../../components/book/Book";
import BookReview from "../../components/review/BookReview";
import ReviewList from "../../components/review/ReviewList";
import BookPageCSS from "./BookPage.module.css";
import {useParams} from "react-router-dom";

function BookPage()
{
    const param = useParams();
    console.log("param", param);

    return (
        <>
            <div className={BookPageCSS.bookPage}>
                <Book/>
                <BookReview/>
                <ReviewList/>
            </div>
        </>
    )
}

export default BookPage;