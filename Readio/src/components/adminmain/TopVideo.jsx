import AdminMainCSS from './adminmain.module.css';

function TopVideo({video})
{
        // const videoSrc = 'https://www.youtube.com/embed/' + video.videoId;

        return (
            <div className={AdminMainCSS.videoInnerContainer}>
                <img className={AdminMainCSS.videoThumbnail} src={video.thumbnail}/>
                <div className={AdminMainCSS.videoTitleDiv}>
                    <p className={AdminMainCSS.videoTitleFont}>
                        {video.title.length > 23 ? video.title.slice(0, 23) + '...' : video.title}
                    </p>
                </div>
                <p className={AdminMainCSS.videoChannelFont}>
                    {video.channelTitle}
                </p>
            </div>
        );
}

export default TopVideo;
