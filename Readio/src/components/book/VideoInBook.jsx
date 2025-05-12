import VideoInBookCSS from "./Book.module.css";


function VideoInBook({video})
{
    const videoSrc = 'https://www.youtube.com/embed/' + video.id.videoId;
    // const videoSrc = 'https://www.youtube.com/embed/xRo27Q3mvto';

    return (
        <div className={VideoInBookCSS.video}>
            <iframe className={VideoInBookCSS.video}
                id="ytplayer"
                type="text/html"
                width="220"
                height="130"
                src={videoSrc}
                frameBorder="0"
                allowFullScreen
                title="YouTube Video"
            />
        </div>
    );

}


export default VideoInBook;