import BookReviewCSS from "./BookReview.module.css";

function BookReview()
{
    return (
        <div className={BookReviewCSS.reviewWriteContainer}>
            <p className={BookReviewCSS.infoBold}>리뷰</p>
            <div className={BookReviewCSS.rating}>
            </div>
            <div className={BookReviewCSS.reviewInput}>
                <textarea className={BookReviewCSS.writeInput} placeholder="리뷰 내용을 입력하세요."/>
                <button className={BookReviewCSS.writeButton}>작성</button>
            </div>
        </div>
    )
}

export default BookReview;
