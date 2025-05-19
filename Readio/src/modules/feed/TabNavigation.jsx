import FeedCSS from '../../pages/Feed/Feed.module.css';

function TabNavigation(props) {
    return (
        <div className={FeedCSS.feedRecDiv}>
            <button
                className={`${FeedCSS.feedRecBt} ${props.activeTab === 'rec' ? FeedCSS.activeTab : ''}`}
                onClick={() => props.onMainTabClick('rec')}
            >
                추천
            </button>
            <button
                className={`${FeedCSS.feedFollowBt} ${props.activeTab === 'following' ? FeedCSS.activeTab : ''}`}
                onClick={() => props.onMainTabClick('following')}
            >
                팔로잉
            </button>
        </div>
    );
}

export default TabNavigation;