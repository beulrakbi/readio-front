import PostListCSS from "./PostList.module.css"
import postDetailHeart from '../../../assets/postDetailHeart.png';
// import postDetailOption from '../../assets/postDetailOption.png';
import postDetailReview from '../../../assets/postDetailReview.png';
import book2 from '../../../assets/book2.png';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {callAllPosts} from "../../../apis/PostAPICalls.js";
import FListCSS from "../../../components/adminfiltering/Filtering.module.css";
import {useNavigate} from "react-router-dom";

function PostList() {

    const [activeTab, setActiveTab] = useState('post');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector(state => state.postReducer);
    const userId = sessionStorage.getItem('userId');

    const { pageInfo } = posts;
    const [start, setStart] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageEnd, setPageEnd] = useState(1);
    const pageNumber = [];
    if (pageInfo) {
        for (let i = 1; i <= pageInfo.pageEnd; i++) {
            pageNumber.push(i);
        }
    }
    useEffect(() => {
        console.log("posts", posts);
    }, [posts]);

    useEffect(() => {
        setStart((currentPage - 1) * 5);
        dispatch(callAllPosts({userId: userId, currentPage: currentPage}));
    }, [currentPage]);



    return (

        <div className={PostListCSS.followDiv}>
            <button className={PostListCSS.followBackBt}>&lt;</button>
            <div className={PostListCSS.followDiv2}>

                <div className={PostListCSS.followTapDiv}>
                    <div className={PostListCSS.followListBtDiv}>
                        <button
                            className={`${PostListCSS.followListBt} ${activeTab === 'post' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('post')}>
                            포스트
                        </button>
                    </div>
                    <div className={PostListCSS.followListBtDiv}>
                        <button
                            className={`${PostListCSS.followListBt} ${activeTab === 'review' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('review')}>
                            리뷰 1
                        </button>
                    </div>
                </div>
                {activeTab === 'post' ? (
                        posts?.data?.map(post => (
                            <div className={PostListCSS.postListDiv} style={{cursor:"pointer"}} key={post.postId} onClick={() => navigate(`/mylibrary/post/${post.postId}`)}>
                                <div className={PostListCSS.postListConDiv}>
                                    <div className={PostListCSS.postListCon}>
                                        <p>{post.postCreatedDate}</p>
                                        <h2>{post.postTitle}</h2>
                                        <p>{post.postContent.length > 80 ? post.postContent.slice(0, 80) + '...' : post.postContent}</p>
                                        <div className={PostListCSS.postListHeartDiv}><span
                                            className={PostListCSS.postListHeartSpan}><img src={postDetailHeart}
                                                                                           className={PostListCSS.postListHeart}/>{post.likes}</span>
                                            <span className={PostListCSS.postListHeartSpan}><img src={postDetailReview}
                                                                                                 className={PostListCSS.postListReview}/>{post.reviewCount}</span>
                                        </div>

                                    </div>
                                    <div className={PostListCSS.postListConImgDiv}>
                                        <img src={post.postImg !== null ? post.postImg?.saveName : post.book?.bookCover}
                                             className={PostListCSS.postListConImg}/>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) :

                    (<div className={PostListCSS.reviewListDiv}>
                        <div className={PostListCSS.reviewListBookDiv}>
                            <img src={book2} className={PostListCSS.reviewListBook}/>
                            <div>
                                <p className={PostListCSS.reviewListrating}>★★★★★</p>
                                <h3 className={PostListCSS.reviewListBookTitle}>신화급 마검 헌터 1권</h3>
                                <p className={PostListCSS.reviewListBookTitle}>태일 지음</p>
                            </div>
                        </div>
                        <div>
                            <p className={PostListCSS.reviewListDate}>2025.4.27</p>
                            <p className={PostListCSS.reviewListCon}>재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여
                                복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검....</p>
                        </div>
                        <div className={PostListCSS.postListHeartDiv}>
                            <span className={PostListCSS.postListHeartSpan}><img src={postDetailHeart}
                                                                                 className={PostListCSS.postListHeart}/>15</span>
                            {/* <div className={PostListCSS.revieListBtDiv}>
                            <button className={PostListCSS.revieListBt}>수정</button>
                            <button className={PostListCSS.revieListBt}>삭제</button>
                        </div> */}
                        </div>
                    </div>)}
                <div className={FListCSS.paging}>
                    {/*{Array.isArray(posts) && (<button*/}
                    {/*        onClick={() => setCurrentPage(currentPage - 1)}*/}
                    {/*        disabled={currentPage === 1}*/}
                    {/*        className={FListCSS.pagingBtn}*/}
                    {/*    >*/}
                    {/*        &lt;*/}
                    {/*    </button>)}*/}
                    {pageNumber.map((num) => (<li
                        style={{all: "unset"}}
                        key={num}
                        onClick={() => setCurrentPage(num)}
                    >
                        <button
                            style={currentPage === num ? {backgroundColor: '#AF4C3F'} : null}
                            className={FListCSS.pagingBtn}
                        >
                            {num}
                        </button>
                    </li>))}
                    {/*{Array.isArray(posts) && (<button*/}
                    {/*        className={FListCSS.pagingBtn}*/}
                    {/*        onClick={() => setCurrentPage(currentPage + 1)}*/}
                    {/*        disabled={currentPage === pageInfo.pageEnd || pageInfo.total == 0}*/}
                    {/*    >*/}
                    {/*        &gt;*/}
                    {/*    </button>)}*/}
                </div>
            </div>
        </div>)
}

export default PostList
