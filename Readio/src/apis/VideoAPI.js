import sample from "./test.json";



export function getVideos(keywords, keywordsToDelete)
{
    // const baseUrl = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=25&regionCode=kr&key=AIzaSyDhnTEJd1zHHo-o98rsn51pHTYX8mbPI4I';
    // const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=고양이&type=video&maxResults=25&key=AIzaSyA2Cyb_5A9hMOylg1aAqCBSbsaUfYnHMEA'
    
    keywords.filter(keyword => !keywordsToDelete.include(keyword));
    
    const refinedKeywords = keywords.join('|');
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + refinedKeywords + '&type=video&maxResults=25&key=AIzaSyA2Cyb_5A9hMOylg1aAqCBSbsaUfYnHMEA';
    

    return fetch(baseUrl)
    .then(data => data.json())
    .then(data => data.items);
}

export function getVideosTest()
{
    return sample;
}