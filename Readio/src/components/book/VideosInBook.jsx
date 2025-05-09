import { useEffect, useState } from "react";
import { getVideosTest } from "../../apis/VideoAPI";

function VideosInBook()
{
    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        setVideos(getVideosTest().items);
    }, [])
    
    return (
        <div>
            <p>관련영상</p>
            
        </div>
    )
}

export default VideosInBook;
