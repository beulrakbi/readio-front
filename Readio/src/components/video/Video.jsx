import VideoCSS from "./videoList.module.css";


function Video({ video }) {
    const videoSrc = 'https://www.youtube.com/embed/' + video.id.videoId;
    // const videoSrc = 'https://www.youtube.com/embed/xRo27Q3mvto';

    return (
        <div className={VideoCSS.videoDiv}>
            <img className={VideoCSS.videoThumbnail} src={video.snippet.thumbnails.medium.url}/>
            <div className={VideoCSS.videoTitleDiv}>
            <p className={VideoCSS.videoTitleFont}>
                {video.snippet.title.length > 23 ? video.snippet.title.slice(0, 23) + '...' : video.snippet.title}
            </p>
            </div>
            <p className={VideoCSS.videoChannelFont}>
                {video.snippet.channelTitle}
            </p>
        </div>
    );
}

export default Video;
