import FollowCSS from "./Follow.module.css"
import profileImg1 from '../../../assets/profileImg1.png';
import profileImg3 from '../../../assets/profileImg3.png';
import { useState } from 'react';



function FollowList () {

    const [activeTab, setActiveTab] = useState('follower');
    const [isFollowing, setIsFollowing] = useState(false);

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <div className={FollowCSS.followDiv}>
            <button className={FollowCSS.followBackBt}>&lt; cOwsun</button>
            <div className={FollowCSS.followTapDiv}>
                <div className={FollowCSS.followListBtDiv}>
                    <button className={`${FollowCSS.followListBt} ${activeTab === 'follower' ? FollowCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('follower')}>
                            팔로워 2
                    </button>
                </div>
                <div className={FollowCSS.followListBtDiv}>
                    <button className={`${FollowCSS.followListBt} ${activeTab === 'following' ? FollowCSS.activeTab : ''}`}
                            onClick={() => setActiveTab('following')}>
                            팔로잉 4
                    </button>
                </div>
            </div>
            {activeTab === 'follower' ? (
                <div className={FollowCSS.followProfileDiv}>
                    <img src={profileImg3} className={FollowCSS.followProfileImg} alt="profile" />
                    <div className={FollowCSS.followProfile}>
                        <li className={FollowCSS.followProfileFont}>강적99</li>
                        <li className={FollowCSS.followFont}>팔로워 51명</li>
                    </div>
                    <button
                        className={`${FollowCSS.followBt} ${isFollowing ? FollowCSS.followingBt : ''}`}
                        onClick={toggleFollow}
                        >
                        {isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                </div>
            ) : (
                <div className={FollowCSS.followProfileDiv}>
                    <img src={profileImg1} className={FollowCSS.followProfileImg} alt="profile" />
                    <div className={FollowCSS.followProfile}>
                        <li className={FollowCSS.followProfileFont}>토리_tory</li>
                        <li className={FollowCSS.followFont}>팔로워 23명</li>
                    </div>
                    <button
                        className={`${FollowCSS.followBt} ${isFollowing ? FollowCSS.followingBt : ''}`}
                        onClick={toggleFollow}
                        >
                        {isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default FollowList