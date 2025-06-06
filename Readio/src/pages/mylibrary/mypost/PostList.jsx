import PostListCSS from "./PostList.module.css"
import postDetailHeart from '../../../assets/postDetailHeart.png';
// import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReview from '../../../assets/postDetailReview.png';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {callAllPosts} from "../../../apis/PostAPICalls.js";
import FListCSS from "../../../components/adminfiltering/Filtering.module.css";
import {useLocation, useNavigate} from "react-router-dom";
import {callMyBookReviewsAPI} from "../../../apis/BookAPICalls.js";
import dayjs from "dayjs";

function PostList() {

    const location = useLocation();
    const click = location.state?.click || 'post'; // 기본값 fallback

    const [activeTab, setActiveTab] = useState(click);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector(state => state.postReducer);
    const reviews = useSelector(state => state.bookReview.reviews);
    const userId = sessionStorage.getItem('userId');

    const postPageInfo = posts.pageInfo;
    const reviewPageInfo = reviews.pageInfo;
    const [startPost, setPostStart] = useState(0);
    const [startReveiw, setReviewStart] = useState(0);
    const [currentPostPage, setCurrentPostPage] = useState(1);
    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const [pageEnd, setPageEnd] = useState(1);
    const postPageNumber = [];
    const reviewPageNumber = [];

    if (postPageInfo) {
        for (let i = 1; i <= postPageInfo.pageEnd; i++) {
            postPageNumber.push(i);
        }
    }

    if (reviewPageInfo) {
        for (let i = 1; i <= reviewPageInfo.pageEnd; i++) {
            reviewPageNumber.push(i);
        }
    }

    useEffect(() => {
        console.log("posts", posts);
        console.log("reviews", reviews)
    }, [posts, reviews]);

    useEffect(() => {
        setPostStart((currentPostPage - 1) * 5);
        setReviewStart((currentReviewPage - 1) * 5);
        dispatch(callAllPosts({userId: userId, currentPage: currentPostPage}));
        dispatch(callMyBookReviewsAPI({currentPage: currentReviewPage}));

        console.log("postPage", currentPostPage, postPageInfo);
        console.log("reviewPage", currentReviewPage, reviewPageInfo);

    }, [currentPostPage, currentReviewPage, activeTab]);

    useEffect(() => {
        dispatch(callAllPosts({userId: userId, currentPage: currentPostPage}));
        dispatch(callMyBookReviewsAPI({currentPage: currentReviewPage}));
    }, [])


    return (

        <div className={PostListCSS.followDiv}>
            <button className={PostListCSS.followBackBt}>&lt;</button>
            <div className={PostListCSS.followDiv2}>

                <div className={PostListCSS.followTapDiv}>
                    <div className={PostListCSS.followListBtDiv}>
                        <button
                            className={`${PostListCSS.followListBt} ${activeTab === 'post' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('post')}>
                            포스트 {posts?.pageInfo?.total}
                        </button>
                    </div>
                    <div className={PostListCSS.followListBtDiv}>
                        <button
                            className={`${PostListCSS.followListBt} ${activeTab === 'review' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('review')}>
                            리뷰 {reviews?.pageInfo?.total}
                        </button>
                    </div>
                </div>
                {activeTab === 'post' ? (Array.isArray(posts?.data) ? posts.data.map(post => (
                    <div className={PostListCSS.postListDiv} style={{cursor: "pointer"}} key={post.postId}
                         onClick={() => navigate(`/mylibrary/post/${post.postId}`)}>
                        <div className={PostListCSS.postListConDiv}>
                            <div className={PostListCSS.postListCon}>
                                <p>{post.postCreatedDate}</p>
                                <h2>{post.postTitle}</h2>
                                <p>{post.postContent.length > 80 ? post.postContent.slice(0, 80) + '...' : post.postContent}</p>
                                <div className={PostListCSS.postListHeartDiv}><span
                                    className={PostListCSS.postListHeartSpan}><img src={postDetailHeart}
                                                                                   className={PostListCSS.postListHeart}/>{post.likes}</span>
                                    <span className={PostListCSS.postListHeartSpan}>
                                        <img src={postDetailReview} className={PostListCSS.postListReview}/>
                                        {post.reviewCount}
                                    </span>
                                </div>
                            </div>
                            <div className={PostListCSS.postListConImgDiv}>
                                <img src={post.postImg !== null ? post.postImg?.saveName : post.book?.bookCover}
                                     className={PostListCSS.postListConImg}/>
                            </div>
                        </div>
                    </div>)) : null) : ((Array.isArray(reviews?.data) ? reviews.data.map(review => (
                    <div className={PostListCSS.reviewListDiv} key={review.reviewId} style={{cursor: "pointer"}}
                         onClick={() => navigate(`/bookPage/${review.bookIsbn}`)}>
                        <div className={PostListCSS.reviewListConDiv}>
                            <div className={PostListCSS.reviewListCon}>
                                <p className={PostListCSS.reviewListrating}>★★★★★</p>
                                <h3 className={PostListCSS.fontMargin}>
                                    {review.book.bookTitle.length > 45 ? review.book.bookTitle.slice(0, 45) + '...' : review.book.bookTitle}
                                </h3>
                                <p className={PostListCSS.reviewListBookTitle}>{review.book.bookAuthor}</p>
                                <p className={PostListCSS.reviewListDate}>{dayjs(review.createdAt).format('YYYY-MM-DD')}</p>
                                <p className={PostListCSS.reviewListDate}>
                                    {review.reviewContent.length > 80 ? review.reviewContent.slice(0, 80) + '...' : review.reviewContent}
                                </p>
                                <div className={PostListCSS.postListHeartDiv}>
                                    <img src={postDetailHeart} className={PostListCSS.postListHeart}/>
                                    <p>{review.likes}</p>
                                </div>

                            </div>
                            <div className={PostListCSS.reivewListConImgDiv}>
                                <img src={review.book.bookCover} className={PostListCSS.postListConImg}/>
                            </div>

                        </div>
                    </div>)) : null))}

                {activeTab === 'post' ?
                    (<div className={FListCSS.paging}>
                        {postPageNumber.map((num) => (<li
                            style={{all: "unset"}}
                            key={num}
                            onClick={() => setCurrentPostPage(num)}
                            >
                                <button
                                    style={currentPostPage === num ? {backgroundColor: '#AF4C3F'} : null}
                                    className={FListCSS.pagingBtn}>
                                        {num}
                                </button>
                            </li>))}
                    </div>) : (
                        <div className={FListCSS.paging}>
                            {reviewPageNumber.map((num) => (<li
                                style={{all: "unset"}}
                                key={num}
                                onClick={() => setCurrentReviewPage(num)}
                            >
                                <button
                                    style={currentReviewPage === num ? {backgroundColor: '#AF4C3F'} : null}
                                    className={FListCSS.pagingBtn}>
                                    {num}
                                </button>
                            </li>))}
                        </div>)}
            </div>
        </div>)
}

export default PostList
