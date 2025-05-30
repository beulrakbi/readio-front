import VideoInBookCSS from "./Book.module.css";
import VideoCSS from "../video/VideoList.module.css";


function VideoInBook({video})
{
    // const videoSrc = 'https://www.youtube.com/embed/' + video.id.videoId;
    // const videoSrc = 'https://www.youtube.com/embed/xRo27Q3mvto';

    return (
        <div className={VideoInBookCSS.video}>
            <div className={VideoInBookCSS.videoDiv}>
                <img className={VideoInBookCSS.videoThumbnail} src={video.snippet.thumbnails.medium.url}/>
                <div className={VideoInBookCSS.videoTitleDiv}>
                    <p className={VideoInBookCSS.videoTitleFont}>
                        {video.snippet.title.length > 18 ? video.snippet.title.slice(0, 18) + '...' : video.snippet.title}
                    </p>
                </div>
                <p className={VideoInBookCSS.videoChannelFont}>
                    {video.snippet.channelTitle}
                </p>
            </div>
            {/*<iframe className={VideoInBookCSS.video}*/}
            {/*    id="ytplayer"*/}
            {/*    type="text/html"*/}
            {/*    width="220"*/}
            {/*    height="130"*/}
            {/*    src={videoSrc}*/}
            {/*    frameBorder="0"*/}
            {/*    allowFullScreen*/}
            {/*    title="YouTube Video"*/}
            {/*/>*/}
        </div>
    );

}


export default VideoInBook;