import PostListCSS from "./PostList.module.css";
import postDetailHeart from '../../../assets/postDetailHeart.png';
import postDetailReviewIcon from '../../../assets/postDetailReview.png';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "../calendar/Calendar.module.css"; // useParams, useLocation 추가

// --- 유틸리티 함수 ---

// 인증 헤더를 가져오는 함수
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    // Content-Type과 Accept 헤더는 필요에 따라 추가/제거
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', Accept:'*/*' } : {'Content-Type': 'application/json', Accept:'*/*'};
};

// 책 정보 로드 실패 시 임시 데이터를 반환하는 함수
const getTemporaryBookDetails = (isbn) => {
    const isbnText = isbn || "정보 없음";
    return {
        cover: `https://placehold.co/100x150?text=ISBN:${isbnText}`,
        title: `(책 정보 로드 실패 - ISBN: ${isbnText})`,
        author: "(저자 정보 로드 실패)"
    };
};

// 이미지 로드 실패 시 대체 UI를 처리하는 함수
const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.style.display = 'none';
    if (e.target.parentElement) {
        e.target.parentElement.innerHTML = `<div class="${PostListCSS.reviewListBookPlaceholder}">표시할 수 없는 이미지</div>`;
    }
};

// --- PostList 컴포넌트 시작 ---

function PostList() {
    const navigate = useNavigate();
    const location = useLocation(); // location 훅 추가
    const { userId: paramUserId } = useParams(); // URL 파라미터에서 userId 가져오기
    const currentLoginUserId = sessionStorage.getItem('userId');
    // 실제 API 호출에 사용될 userId. paramUserId가 있다면 해당 사용자의 ID, 없다면 로그인된 사용자의 ID
    const displayUserId = paramUserId || currentLoginUserId;

    const [activeTab, setActiveTab] = useState('post');

    // 라우터 state를 통해 activeTab 초기값 설정 (ProfileSection에서 전달받을 수 있도록)
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]); // location.state가 변경될 때마다 실행

    // 포스트 관련 상태 (무한 스크롤)
    const [postsData, setPostsData] = useState([]);
    const [currentPostPage, setCurrentPostPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0); // 전체 포스트 개수 상태 추가!

    // 무한 스크롤을 위한 Intersection Observer 관련 ref
    const observer = useRef();
    const scrollContainerRef = useRef(null); // 스크롤 가능한 영역의 ref

    // 리뷰 관련 상태
    const [myReviews, setMyReviews] = useState([]);
    const [myReviewsLoading, setMyReviewsLoading] = useState(false);
    const [myReviewsError, setMyReviewsError] = useState(null);
    const [myReviewsCount, setMyReviewsCount] = useState(0);

    // 포스트 데이터를 비동기로 불러오는 함수
    const fetchPosts = useCallback(async (pageToFetch) => {
        if (!displayUserId) { // 실제 표시할 userId 사용
            setPostsLoading(false);
            setPostsError("사용자 ID가 없어 포스트를 로드할 수 없습니다.");
            setHasMorePosts(false);
            setTotalPosts(0); // 에러 시 전체 포스트 개수 초기화
            return;
        }
        setPostsLoading(true);
        setPostsError(null);
        try {
            // displayUserId를 사용하여 API 호출
            const requestURL = `http://localhost:8080/mylibrary/post/${displayUserId}/all?offset=${pageToFetch}`;
            const response = await fetch(requestURL, { method: 'GET', headers: getAuthHeader() });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `포스트 로드 실패: ${response.status}` }));
                throw new Error(errorData.message || `포스트 로드 실패: ${response.status}`);
            }
            const result = await response.json();

            if (result.status === 200 && result.data) {
                const newPosts = result.data.data || [];
                // 페이지가 1이면 기존 데이터 초기화 후 새 데이터, 아니면 기존 데이터에 추가
                setPostsData(prevPosts => pageToFetch === 1 ? newPosts : [...prevPosts, ...newPosts]);
                setHasMorePosts(pageToFetch < (result.data.pageInfo?.pageEnd || 0));
                // !!! 전체 포스트 개수 업데이트 !!!
                setTotalPosts(result.data.pageInfo?.total || 0); // 백엔드에서 받은 total 값을 설정
            } else {
                throw new Error(result.message || '포스트 데이터 로드 실패 또는 형식이 올바르지 않습니다.');
            }
        } catch (err) {
            setPostsError(err.message);
            setHasMorePosts(false);
            setTotalPosts(0); // 에러 발생 시 0으로 초기화
        } finally {
            setPostsLoading(false);
        }
    }, [displayUserId]); // displayUserId가 변경될 때만 함수가 재생성됨

    // 내 리뷰의 총 개수만 비동기로 가져오는 함수
    const fetchMyReviewsCount = useCallback(async () => {
        if (!displayUserId) { // 실제 표시할 userId 사용
            setMyReviewsCount(0);
            return;
        }
        try {
            // 나의 리뷰를 가져오므로 displayUserId (로그인된 사용자)의 리뷰를 가져옴
            const requestURL = `http://localhost:8080/bookReview/reviews/my`;
            const response = await fetch(requestURL, { method: 'GET', headers: getAuthHeader() });
            if (!response.ok) {
                console.error(`리뷰 개수 로드 실패: ${response.status}`);
                setMyReviewsCount(0);
                return;
            }
            const result = await response.json();
            setMyReviewsCount((result && result.length) || 0);
        } catch (err) {
            console.error(`리뷰 개수 로드 중 오류 발생: ${err.message}`);
            setMyReviewsCount(0);
        }
    }, [displayUserId]); // displayUserId가 변경될 때만 함수가 재생성됨

    // 내 리뷰 데이터를 비동기로 불러오는 함수 (최신순 정렬 포함)
    const fetchMyReviews = useCallback(async () => {
        setMyReviewsLoading(true);
        setMyReviewsError(null);
        try {
            const requestURL = `http://localhost:8080/bookReview/reviews/my`;
            const response = await fetch(requestURL, { method: 'GET', headers: getAuthHeader() });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `나의 리뷰 로드 실패: ${response.status}` }));
                throw new Error(errorData.message || `나의 리뷰 로드 실패: ${response.status}`);
            }
            const result = await response.json();

            if (result && result.length > 0) {
                const sortedReviews = [...result].sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB - dateA;
                });
                setMyReviews(sortedReviews);
                setMyReviewsCount(sortedReviews.length);
            } else {
                setMyReviews([]);
                setMyReviewsCount(0);
            }
        } catch (err) {
            setMyReviewsError(err.message);
        } finally {
            setMyReviewsLoading(false);
        }
    }, []); // 의존성 없음 (함수 내부에서 상태를 직접 변경하므로)

    // --- useEffect 훅 ---

    // 컴포넌트 마운트 시 또는 displayUserId/activeTab 변경 시 초기 데이터 로드
    useEffect(() => {
        if (displayUserId) {
            if (activeTab === 'post') {
                setPostsData([]); // 탭 전환 시 기존 데이터 초기화
                setCurrentPostPage(1); // 페이지 초기화
                fetchPosts(1); // 첫 페이지 로드
            } else if (activeTab === 'review') {
                fetchMyReviews(); // 리뷰 데이터 로드
            }
            fetchMyReviewsCount(); // 리뷰 카운트는 항상 가져옴 (포스트/리뷰 탭 모두에서 필요)
        } else {
            // 사용자 ID가 없을 경우 모든 상태 초기화
            setPostsData([]);
            setPostsError("로그인이 필요합니다.");
            setHasMorePosts(false);
            setTotalPosts(0);
            setMyReviewsCount(0);
        }
    }, [displayUserId, activeTab, fetchPosts, fetchMyReviews, fetchMyReviewsCount]);


    // 무한 스크롤을 위한 마지막 포스트 요소 감지
    const lastPostElementRef = useCallback(node => {
        if (postsLoading) return; // 로딩 중이면 관찰하지 않음
        if (observer.current) observer.current.disconnect(); // 기존 observer 연결 해제

        // scrollContainerRef가 null이 아닌지 확인하여 root 엘리먼트 설정
        const rootElement = scrollContainerRef.current;
        if (!rootElement) return;

        observer.current = new IntersectionObserver(entries => {
            // 요소가 뷰포트에 들어왔고, 더 로드할 포스트가 있으며, 현재 탭이 'post'일 때
            if (entries[0].isIntersecting && hasMorePosts && activeTab === 'post') {
                setCurrentPostPage(prevPage => prevPage + 1); // 다음 페이지 로드 요청
            }
        }, {
            root: rootElement, // 스크롤이 발생하는 컨테이너 지정
            rootMargin: '0px',
            threshold: 1.0 // 대상 요소가 뷰포트의 100% 보일 때 콜백 실행
        });

        if (node) observer.current.observe(node); // 새로운 대상 요소 관찰 시작
    }, [postsLoading, hasMorePosts, activeTab]); // postsLoading, hasMorePosts, activeTab 변경 시 observer 재생성

    // currentPostPage가 변경되면 해당 페이지의 포스트 로드
    useEffect(() => {
        // currentPostPage가 1보다 크고 (이미 첫 페이지 로드), activeTab이 'post'이며,
        // displayUserId가 있고, 더 로드할 포스트가 남아있을 때만 fetchPosts 호출
        if (currentPostPage > 1 && activeTab === 'post' && displayUserId && hasMorePosts) {
            fetchPosts(currentPostPage);
        }
    }, [currentPostPage, activeTab, displayUserId, hasMorePosts, fetchPosts]);


    // --- 컴포넌트 렌더링 ---
    return (
        <div className={PostListCSS.followDiv}>
            <button className={PostListCSS.followBackBt} onClick={() => navigate('/mylibrary')}>&lt; 뒤로가기</button>
            <div className={PostListCSS.followDiv2}>
                <div className={PostListCSS.followTapDiv}>
                    <div className={PostListCSS.followListBtDiv}>
                        <button
                            className={`${PostListCSS.followListBt} ${activeTab === 'post' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('post')}>
                            {/* postsData.length 대신 totalPosts 사용 */}
                            포스트 {`(${totalPosts})`}
                        </button>
                    </div>
                    <div className={PostListCSS.followListBtDiv}>
                        <button
                            className={`${PostListCSS.followListBt} ${activeTab === 'review' ? PostListCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('review')}>
                            리뷰 {`(${myReviewsCount})`}
                        </button>
                    </div>
                </div>

                {/* 스크롤 가능한 영역 */}
                <div ref={scrollContainerRef} className={PostListCSS.scrollableListArea}>
                    {activeTab === 'post' && (
                        <>
                            {postsData && postsData.length > 0 ? (
                                postsData.map((post, index) => {
                                    const postImageUrl = post.postImg?.saveName || post.book?.bookCover;
                                    const itemKey = `${post.postId || 'post'}-${index}`; // 고유한 key 생성

                                    const postItem = (
                                        <div
                                            className={PostListCSS.postListDiv}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => post.postId && navigate(`/mylibrary/post/${post.postId}`)}
                                        >
                                            <div className={PostListCSS.postListConDiv}>
                                                <div className={PostListCSS.postListCon}>
                                                    <p>{post.postCreatedDate || '날짜 정보 없음'}</p>
                                                    <h2>{post.postTitle || '제목 없음'}</h2>
                                                    <p>{post.postContent ? (post.postContent.length > 80 ? post.postContent.slice(0, 80) + '...' : post.postContent) : '내용 없음'}</p>
                                                    <div className={PostListCSS.postListHeartDiv}>
                                                        <span className={PostListCSS.postListHeartSpan}>
                                                            <img src={postDetailHeart} className={PostListCSS.postListHeart} alt="좋아요"/>
                                                            {post.likes !== undefined ? post.likes : 0}
                                                        </span>
                                                        <span className={PostListCSS.postListHeartSpan}>
                                                            <img src={postDetailReviewIcon} className={PostListCSS.postListReview} alt="리뷰 수"/>
                                                            {post.reviewCount !== undefined ? post.reviewCount : 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={PostListCSS.postListConImgDiv}>
                                                    {postImageUrl ? (
                                                        <img
                                                            src={postImageUrl}
                                                            className={PostListCSS.postListConImg}
                                                            alt={post.postTitle || "포스트 이미지"}
                                                            onError={handleImageError}
                                                        />
                                                    ) : (
                                                        <div className={PostListCSS.postListConImgPlaceholder}>이미지 없음</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );

                                    // 마지막 포스트에 ref를 연결하여 Intersection Observer로 감지
                                    if (postsData.length === index + 1) {
                                        return <div ref={lastPostElementRef} key={itemKey}>{postItem}</div>;
                                    } else {
                                        return <div key={itemKey}>{postItem}</div>;
                                    }
                                })
                            ) : null }
                            {postsLoading && <p style={{textAlign: 'center', padding: '20px'}}>포스트 로딩 중...</p>}
                            {postsError && <p style={{textAlign: 'center', padding: '20px', color: 'red'}}>포스트 로딩 오류: {postsError}</p>}
                            {!postsLoading && !postsError && postsData.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>작성한 포스트가 없습니다.</p>}
                            {!hasMorePosts && postsData.length > 0 && !postsLoading && !postsError && <p style={{textAlign: 'center', padding: '20px'}}>모든 포스트를 불러왔습니다.</p>}
                        </>
                    )}

                    {activeTab === 'review' && (
                        myReviewsLoading ? <p style={{textAlign: 'center', padding: '20px'}}>리뷰 로딩 중...</p> :
                        myReviewsError ? <p style={{textAlign: 'center', padding: '20px', color: 'red'}}>리뷰를 불러오는 중 오류가 발생했습니다: {myReviewsError}</p> :
                        myReviews && myReviews.length > 0 ? (
                            myReviews.map((review) => {
                                if (!review || typeof review.reviewId === 'undefined') {
                                    return <p key={`invalid-review-${Date.now()}-${Math.random()}`}>잘못된 리뷰 데이터 형식입니다.</p>;
                                }

                                const bookDataFromApi = review.book;
                                const isbn = review.bookIsbn;

                                const actualCoverUrl = bookDataFromApi?.bookCover;
                                const title = bookDataFromApi?.bookTitle || getTemporaryBookDetails(isbn).title;
                                const author = bookDataFromApi?.bookAuthor || getTemporaryBookDetails(isbn).author;

                                let coverToShow = null;
                                let useErrorHandler = false;

                                if (actualCoverUrl && actualCoverUrl.startsWith('http')) {
                                    coverToShow = actualCoverUrl;
                                    useErrorHandler = true;
                                } else if (isbn) {
                                    coverToShow = getTemporaryBookDetails(isbn).cover;
                                }

                                return (
                                    <div
                                        className={PostListCSS.reviewListDiv}
                                        key={review.reviewId} // review.reviewId를 key로 사용
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            if (isbn) {
                                                navigate(`/bookPage/${isbn}`);
                                            } else {
                                                console.warn('ISBN 정보가 없어 책 상세 페이지로 이동할 수 없습니다.', review);
                                            }
                                        }}
                                    >
                                        <div className={PostListCSS.reviewListBookDiv}>
                                            <div className={PostListCSS.reviewListBookCoverContainer}>
                                                {coverToShow ? (
                                                    <img
                                                        src={coverToShow}
                                                        className={PostListCSS.reviewListBook}
                                                        alt={`${title || '책'} 표지`}
                                                        onError={useErrorHandler ? handleImageError : undefined}
                                                    />
                                                ) : (
                                                    <div className={PostListCSS.reviewListBookPlaceholder}>표지 없음</div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className={PostListCSS.reviewListBookTitle}>{title}</h3>
                                                <p className={PostListCSS.reviewListBookTitle}>{author}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className={PostListCSS.reviewListDate}>
                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '날짜 정보 없음'}
                                            </p>
                                            <p className={PostListCSS.reviewListCon}>{review.reviewContent || '내용 없음'}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{textAlign: 'center', padding: '20px'}}>작성한 리뷰가 없습니다.</p>
                        )
                    )}
                </div> {/* 스크롤 가능한 영역 끝 */}
            </div>
        </div>
    );
}

export default PostList;