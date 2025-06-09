import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiGetPostLikeInfo, apiLikePost, apiUnlikePost } from '../../apis/PostLikeAPICalls'; // 경로 확인

import PostCSS from '../../pages/post/Post.module.css'; // PostDetail의 CSS 모듈 경로
import postLike from '../../assets/postLike.png';         // '좋아요 안 함' 아이콘
import postBeLike from '../../assets/postBeLike.png';     // '좋아요 함' 아이콘

function PostLikeButton({ postId, onLikeDataLoaded }) {
    const dispatch = useDispatch();

    const likeInfo = useSelector(state => state.likeReducer.posts?.[postId]);
    const isLiked = likeInfo?.isLiked || false;
    const isLoading = likeInfo?.isLoading || false;

    const isLoggedIn = !!sessionStorage.getItem("accessToken");
        console.log('[LikeButton] handleLikeToggle called!');
        console.log('[LikeButton] isLoggedIn:', isLoggedIn);
        console.log('[LikeButton] isLoading:', isLoading);
        console.log('[LikeButton] postId:', postId);
        console.log('[LikeButton] current isLiked state:', isLiked);

    useEffect(() => {
        // 로그인 상태이고, 아직 해당 게시물의 좋아요 정보가 없을 때만 서버에 요청
        if (isLoggedIn && postId && likeInfo === undefined) {
            dispatch(apiGetPostLikeInfo(postId));
        }
    }, [dispatch, postId, isLoggedIn, likeInfo]);

    useEffect(() => {
        if (typeof onLikeDataLoaded === 'function' && likeInfo) {
            onLikeDataLoaded(likeInfo); // { isLiked, likeCount } 객체 전체를 전달
        }
    }, [likeInfo, onLikeDataLoaded]);
    
    const handleLikeToggle = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 기능입니다.");
            return;
        }
        if (isLoading) 
            return;
        

        if (isLiked) {
            console.log('[LikeButton] Dispatching apiUnlikePost for postId:', postId);
            dispatch(apiUnlikePost(postId));
        } else {
            console.log('[LikeButton] Dispatching apiLikePost for postId:', postId);
            dispatch(apiLikePost(postId));
        }
    };

    if (!postId) return null;
    
    const likeButtonImage = isLiked ? postLike : postBeLike; // isLiked가 true면 채워진 하트(postBeLike)
    const likeButtonClass = `${PostCSS.postDetailLikebt} ${isLiked ? PostCSS.liked : ''}`;

    return (
        <button
            className={likeButtonClass}
            onClick={handleLikeToggle}
            disabled={!isLoggedIn || isLoading}
        >
            <img
                src={likeButtonImage}
                className={PostCSS.postDetailLike}
                alt="like button"
            />
        </button>
    );
}

export default PostLikeButton;