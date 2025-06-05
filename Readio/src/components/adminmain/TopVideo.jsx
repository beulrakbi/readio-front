import AdminMainCSS from './adminmain.module.css';
import { Link } from 'react-router-dom';

function TopVideo({video})
{
        // const videoSrc = 'https://www.youtube.com/embed/' + video.videoId;

    return (
        <Link to={`/video/${video.contentId}`} className={AdminMainCSS.videoLink}>
            <div className={AdminMainCSS.videoInnerContainer}>
                <img className={AdminMainCSS.videoThumbnail} src={video.thumbnail} alt={video.title} />
                <div className={AdminMainCSS.videoTitleDiv}>
                    <p className={AdminMainCSS.videoTitleFont}>
                        {video.title.length > 23 ? video.title.slice(0, 23) + '...' : video.title}
                    </p>
                </div>
                <p className={AdminMainCSS.videoChannelFont}>
                    {video.channelTitle}
                </p>
            </div>
        </Link>
    );
}

export default TopVideo;
