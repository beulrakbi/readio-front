import { useState } from 'react';
import book2 from '../../assets/book2.png';
import feedConImg from '../../assets/feedConImg.png';
import profileImg2 from '../../assets/profileImg2.png';
import profileImg3 from '../../assets/profileImg3.png';
import FeedItemPost from '../../modules/feed/FeedItemPost';
import FeedItemReview from '../../modules/feed/FeedItemReview';
import SubTabNavigation from '../../modules/feed/SubTabNavigation';
import TabNavigation from '../../modules/feed/TabNavigation';
import FeedCSS from './Feed.module.css';

function FeedMain() {
    const [activeTab, setActiveTab] = useState('rec');
    const [subTab, setSubTab] = useState('all');
    const [isFollowing, setIsFollowing] = useState(false);
    const [likeTab, setLikeTab] = useState(false);

    const handleMainTabClick = (tabName) => {
        setActiveTab(tabName);
        setSubTab('all');
    };

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    const toggleLike = () => {
        setLikeTab(prevLikeTab => typeof prevLikeTab === 'string' ? true : !prevLikeTab);
    };

    const isLikedBoolean = typeof likeTab === 'string' ? false : likeTab;

    const renderRec = () => {
        if (subTab === 'all') {
            return (
                <>
                    <FeedItemPost
                        profileImg={profileImg3}
                        userName="강적99"
                        postMeta="포스트 • 3분전"
                        isLikedProp={isLikedBoolean}
                        isFollowingProp={isFollowing}
                        onToggleLike={toggleLike}
                        onToggleFollow={toggleFollow}
                        title="어른의 맞춤법"
                        text="읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다."
                        contentImg={feedConImg}
                        likesCount={15}
                        reviewsCount={3}
                    />
                    <FeedItemReview
                        profileImg={profileImg2}
                        userName="배병"
                        postMeta="리뷰 • 5분전"
                        isLikedProp={isLikedBoolean}
                        isFollowingProp={isFollowing}
                        onToggleLike={toggleLike}
                        onToggleFollow={toggleFollow}
                        reviewText="재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검...."
                        bookImg={book2}
                        bookTitle="신화급 마검 헌터 1권"
                        bookAuthor="태일 지음"
                    />
                </>
            );
        } else if (subTab === 'post') {
            return (
                <FeedItemPost
                    profileImg={profileImg3}
                    userName="강적99"
                    postMeta="포스트 • 3분전"
                    isLikedProp={isLikedBoolean}
                    isFollowingProp={isFollowing}
                    onToggleLike={toggleLike}
                    onToggleFollow={toggleFollow}
                    title="어른의 맞춤법"
                    text="읽은 기간 : 25.04.15 / 25.04.26 읽은 부분 : 시작 ~ 너도나도 헷갈리는 기초 맞춤법 규정 1. - 맞춤법을 공부할 때 마음가짐으로 삼아야겠따. 독서 일기를 수시로 따로 쓰니 밀리에 독서 감상을 자세히 적어야 할 이유를 못느끼겠다. 앞으로는 독서 후에 새롭게 알게된 내용을 정리하기 보단 감상 위주로 적어야겠다."
                    contentImg={feedConImg}
                    likesCount={15}
                    reviewsCount={3}
                />
            );
        } else { // subTab === 'review'
            return (
                <FeedItemReview
                    profileImg={profileImg2}
                    userName="배병"
                    postMeta="리뷰 • 5분전"
                    isLikedProp={isLikedBoolean}
                    isFollowingProp={isFollowing}
                    onToggleLike={toggleLike}
                    onToggleFollow={toggleFollow}
                    reviewText="재미있었습니다 주인공이 마지막 전투에서 막검을 얻은 후 동료들에게 배신을 당하고 회귀하여 복수하는 내용입니다 많이 보이는 설정이죠? 그럼에도 나름 스토리라인이 억지스럽지 않고 매끄럽게 진행되어갑니다 물론 막검...."
                    bookImg={book2}
                    bookTitle="신화급 마검 헌터 1권"
                    bookAuthor="태일 지음"
                />
            );
        }
    }

    const renderFollowing = () => {
        if (subTab === 'all') {
            return (
                <>
                    <FeedItemPost
                        profileImg={profileImg3}
                        userName="강적99"
                        postMeta="포스트 • 3분전"
                        isLikedProp={isLikedBoolean}
                        isFollowingProp={isFollowing}
                        onToggleLike={toggleLike}
                        onToggleFollow={toggleFollow}
                        title="어른의 맞춤법"
                        text="팔로잉 탭에 표시될 포스트 내용입니다. 실제로는 다른 데이터가 와야 합니다."
                        contentImg={feedConImg}
                        likesCount={15}
                        reviewsCount={3}
                    />
                    <FeedItemReview
                        profileImg={profileImg2}
                        userName="배병"
                        postMeta="리뷰 • 5분전"
                        isLikedProp={isLikedBoolean}
                        isFollowingProp={isFollowing}
                        onToggleLike={toggleLike}
                        onToggleFollow={toggleFollow}
                        reviewText="팔로잉 탭에 표시될 리뷰 내용입니다. 실제로는 다른 데이터가 와야 합니다."
                        bookImg={book2}
                        bookTitle="신화급 마검 헌터 1권"
                        bookAuthor="태일 지음"
                    />
                </>
            );
        } else if (subTab === 'post') {
            return (
                <FeedItemPost
                    profileImg={profileImg3}
                    userName="강적99"
                    postMeta="포스트 • 3분전"
                    isLikedProp={isLikedBoolean}
                    isFollowingProp={isFollowing}
                    onToggleLike={toggleLike}
                    onToggleFollow={toggleFollow}
                    title="어른의 맞춤법"
                    text="팔로잉 탭에 표시될 포스트 내용입니다. 실제로는 다른 데이터가 와야 합니다."
                    contentImg={feedConImg}
                    likesCount={15}
                    reviewsCount={3}
                />
            );
        } else {
            return (
                <FeedItemReview
                    profileImg={profileImg2}
                    userName="배병"
                    postMeta="리뷰 • 5분전"
                    isLikedProp={isLikedBoolean}
                    isFollowingProp={isFollowing}
                    onToggleLike={toggleLike}
                    onToggleFollow={toggleFollow}
                    reviewText="팔로잉 탭에 표시될 리뷰 내용입니다. 실제로는 다른 데이터가 와야 합니다."
                    bookImg={book2}
                    bookTitle="신화급 마검 헌터 1권"
                    bookAuthor="태일 지음"
                />
            );
        }
    }

    return (
        <div className={FeedCSS.feedDiv}>
            <TabNavigation activeTab={activeTab} onMainTabClick={handleMainTabClick} />
            <SubTabNavigation subTab={subTab} onSubTabClick={setSubTab} />
            
            {activeTab === 'rec' ? renderRec() : renderFollowing()}
        </div>
    );
}

export default FeedMain;