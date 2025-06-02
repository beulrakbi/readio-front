import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiGetPostLikeInfo, apiLikePost, apiUnlikePost } from '../../apis/PostLikeAPICalls'; // 경로 확인

import PostCSS from '../../pages/post/Post.module.css'; // PostDetail의 CSS 모듈 경로
import postLike from '../../assets/postLike.png';         // '좋아요 안 함' 아이콘
import postBeLike from '../../assets/postBeLike.png';     // '좋아요 함' 아이콘

function PostLikeButton({ postId }) {
    const dispatch = useDispatch();

    const {
        isLiked = false,    // 기본값: 좋아요 안 함
        isLoading = false,
        // error // 에러 표시는 PostDetail에서 할 수도 있음
    } = useSelector(state => state.likeReducer.posts[postId]) || { 
        isLiked: false, isLoading: true // 데이터 없을 시 초기 로딩으로 간주 (useEffect에서 fetch)
    };
    
    const isLoggedIn = !!localStorage.getItem("accessToken");
        console.log('[LikeButton] handleLikeToggle called!');
        console.log('[LikeButton] isLoggedIn:', isLoggedIn);
        console.log('[LikeButton] isLoading:', isLoading);
        console.log('[LikeButton] postId:', postId);
        console.log('[LikeButton] current isLiked state:', isLiked);

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