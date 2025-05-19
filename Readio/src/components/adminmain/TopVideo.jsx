import AdminMainCSS from './adminmain.module.css';

function TopVideo({video})
{
        const videoSrc = 'https://www.youtube.com/embed/' + video.id.videoId;
        // const videoSrc = 'https://www.youtube.com/embed/xRo27Q3mvto';
    
        return (
            <div className={AdminMainCSS.videoInnerContainer}>
                <iframe className={AdminMainCSS.video}
                    id="ytplayer"
                    type="text/html"
                    width="220"
                    height="120"
                    src={videoSrc}
                    frameBorder="0"
                    allowFullScreen
                    title="YouTube Video"
                    />
                <p className={AdminMainCSS.font3}>어쩌구</p>
                <p className={AdminMainCSS.font3}>어쩌구</p>
                    </div>
        );
}

export default TopVideo;
