import { Link } from "react-router-dom";
import likes from "../../assets/likes.png";
import ReviewCSS from "./BookReview.module.css";

function Review({review})
{

    let date = new Date(review.createdAt);
    const formatted = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}. ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    return (
        <div className={ReviewCSS.review}>
            <div className={ReviewCSS.reviewInfo}>
                <p className={ReviewCSS.reviewInfoFont1}>{review.profileId}님의 리뷰</p>
                <p className={ReviewCSS.reviewInfoFont2}>{formatted}</p>
                <div>
                    {/* 별 */}
                </div>
            </div>

            <div>
                <div className={ReviewCSS.reviewBtBox}>
                    {/* 버튼모음 */}
                    <button className={ReviewCSS.reviewBt}>팔로우</button>
                    <button className={ReviewCSS.reviewBt}><img src={likes} className={ReviewCSS.likes}/>3</button>
                    <Link to="/" className={ReviewCSS.report}>신고하기</Link>
                </div>
                <p className={ReviewCSS.reviewContent}>{review.reviewContent}</p>
            </div>
        </div>
    )

}

export default Review;
