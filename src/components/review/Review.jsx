import { Link } from "react-router-dom";
import likes from "../../assets/likes.png";
import ReviewCSS from "./BookReview.module.css";

function Review({review})
{
    return (
        <div className={ReviewCSS.review}>
            <div className={ReviewCSS.reviewInfo}>
                <p className={ReviewCSS.reviewInfoFont1}>user01님의 리뷰</p>
                <p className={ReviewCSS.reviewInfoFont2}>2025. 04. 27</p>
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
                <p className={ReviewCSS.reviewContent}>너무나 행복한 꽉찬 해피엔딩이어서, 가정환경이 일반적이지 않더라도 불행하지 않은, 희망을 전해주는 소설이라 좋았습니다. 어른이라도 각자의 사정과 부족한 부분들이 있지만서도, 각자 서로 다른 방향으로 부모로서의 역할을 다해내는 모습이, 어른스러운 유코도 알 수 없는 사정들을 숨긴채 사랑을 많이 주었던 것이 인상 깊었습니다.
</p>
            </div>
        </div>
    )

}

export default Review;
