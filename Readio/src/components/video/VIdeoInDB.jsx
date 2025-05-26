import VideoCSS from "./videoList.module.css";

// api에서 가져온 video
function VIdeoInDB({ videoInDB }) {

    return (
        <div className={VideoCSS.videoDiv}>
            <img className={VideoCSS.videoThumbnail} src={videoInDB.thumbnail}/>
            <div className={VideoCSS.videoTitleDiv}>
                <p className={VideoCSS.videoTitleFont}>
                    {videoInDB.title.length > 23 ? videoInDB.title.slice(0, 23) + '...' : videoInDB.title}
                </p>
            </div>
            <p className={VideoCSS.videoChannelFont}>
                {videoInDB.channelTitle}
            </p>
        </div>
    );
}

export default VIdeoInDB;
