import VideoInBookCSS from "./Book.module.css";
import VideoCSS from "../video/VideoList.module.css";


function VideoInBookInDB({videoInDB})
{
    // const videoSrc = 'https://www.youtube.com/embed/' + video.id.videoId;
    // const videoSrc = 'https://www.youtube.com/embed/xRo27Q3mvto';

    return (
        <div className={VideoInBookCSS.video}>
            <img className={VideoInBookCSS.videoThumbnail} src={videoInDB.thumbnail}/>
            <div className={VideoInBookCSS.videoTitleDiv}>
                <p className={VideoInBookCSS.videoTitleFont}>
                    {videoInDB.title.length > 18 ? videoInDB.title.slice(0, 18) + '...' : videoInDB.title}
                </p>
            </div>
            <p className={VideoInBookCSS.videoChannelFont}>
                {videoInDB.channelTitle}
            </p>
        </div>);
}


export default VideoInBookInDB;

// {/*<div className={VideoInBookCSS.video}>*/}
// {/*<iframe className={VideoInBookCSS.video}*/}
// {/*    id="ytplayer"*/}
// {/*    type="text/html"*/}
// {/*    width="220"*/}
// {/*    height="130"*/}
// {/*    src={videoSrc}*/}
// {/*    frameBorder="0"*/}
// {/*    allowFullScreen*/}
// {/*    title="YouTube Video"*/}
// {/*/>*/}
// {/*</div>*/}