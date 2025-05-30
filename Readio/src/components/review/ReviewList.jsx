import Review from "./Review";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {callBookReviewsAPI} from "../../apis/BookAPICalls.js";

function ReviewList({bookIsbn})
{
    const dispatch = useDispatch();
    const bookReviews = useSelector(state => state.bookReview.reviews);

    useEffect(() => {
        const getBookReviews = () => {
            dispatch(callBookReviewsAPI({bookIsbn}));
        }
        getBookReviews();
    }, [bookIsbn]);

    useEffect(() => {
        console.log("bookReview", bookReviews);
    }, [bookReviews])


    return (
        <div>
            {bookReviews.map(bookReview => (bookReview.isHidden === "Y" ? null : (<Review key={bookReview.reviewId} review={bookReview}/>)))}
        </div>
    )
}

export default ReviewList;