import { NavLink } from "react-router-dom";
import FeedRecWriting from '../../assets/FeedRecWriting.png';
import FeedCSS from '../../pages/Feed/Feed.module.css';

function SubTabNavigation(props) {
    return (
        <div className={FeedCSS.feedListBtDiv}>
            <button
                className={`${FeedCSS.feedAllBt} ${props.subTab === 'all' ? FeedCSS.activeTaAf : FeedCSS.feedAllBt}`}
                onClick={() => props.onSubTabClick('all')}
            >
                전체
            </button>
            <button
                className={`${FeedCSS.feedPostBt} ${props.subTab === 'post' ? FeedCSS.activeTaAf : FeedCSS.feedPostBt}`}
                onClick={() => props.onSubTabClick('post')}
            >
                포스트
            </button>
            <button
                className={`${FeedCSS.feedReviewBt} ${props.subTab === 'review' ? FeedCSS.activeTaAf : FeedCSS.feedReviewBt}`}
                onClick={() => props.onSubTabClick('review')}
            >
                리뷰
            </button>
            <NavLink to={"/post/writing"} className={FeedCSS.feedWritingBt}>
                <img src={FeedRecWriting} alt="글쓰기" />
            </NavLink>
        </div>
    );
}

export default SubTabNavigation;