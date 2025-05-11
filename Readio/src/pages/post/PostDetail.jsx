import profileTory from '../../assets/profileTory.png';
import postDetailOption from '../../assets/postDetailOption.png';
import postLike from '../../assets/postLike.png';
import postContentImg from '../../assets/postContentImg.png';
import postDetailHeart from '../../assets/postDetailHeart.png';
import postDetailReview from '../../assets/postDetailReview.png';
import PostCSS from './Post.module.css';

function PostDetail () {
    return (
        <div className={PostCSS.postDetailDiv}>
            <div className={PostCSS.postProfileDiv}>
                <img src={profileTory} className={PostCSS.postProfileIcon}/>
                <div className={PostCSS.postProfile}>
                    <li>토리_tory</li>
                    <li>2025.4.29</li>
                </div>
                <div className={PostCSS.postDetailBtDiv}>
                    <button className={PostCSS.postDetailLikebt}>
                        <img src={postLike} className={PostCSS.postDetailLike}/>
                    </button>
                    <button className={PostCSS.postDetailFollwbt}>팔로우</button>
                    <button className={PostCSS.postDetailOptionbt}>
                        <img src={postDetailOption} className={PostCSS.postDetailOption}/>
                    </button>
                </div>
            </div> 
            <h2 className={PostCSS.postDetailTitle}>진짜 생존 신고</h2>
            <p className={PostCSS.postDetailContent}>어우 학교 못갈수도 있어요</p>
            <img src={postContentImg} className={PostCSS.postContentImg}/>
            <div className={PostCSS.postDetailHeartDiv}>
                <span><img src={postDetailHeart} className={PostCSS.postDetailHeart}/>15</span>
                <span><img src={postDetailReview} className={PostCSS.postDetailReview}/>3</span>
            </div>
        </div>
    )
}

export default PostDetail;