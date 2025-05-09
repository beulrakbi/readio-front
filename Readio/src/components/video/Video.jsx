import VideoCSS from "./videoList.module.css";


function Video({ video }) {
    const videoSrc = 'https://www.youtube.com/embed/' + video.id.videoId;
    // const videoSrc = 'https://www.youtube.com/embed/xRo27Q3mvto';

    return (
        <div className={VideoCSS.video}>
            <iframe className={VideoCSS.video}
                id="ytplayer"
                type="text/html"
                width="320"
                height="180"
                src={videoSrc}
                frameBorder="0"
                allowFullScreen
                title="YouTube Video"
            />
        </div>
    );
}

export default Video;
