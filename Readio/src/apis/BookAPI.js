export function getBooks()
{

    const baseUrl = 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbbbyubbu1233001&itemIdType=ISBN&ItemId=9788967442088&output=js&Version=20131101&OptResult=ebookList,usedList,reviewList';
    
    return fetch(baseUrl)
    .then(data => data.json())
    .then(data => data.item);
}

export function getBook(ISBN)
{

}

export function testBook() {
    // CORS 프록시 서비스를 통해 요청
    const corsProxy = 'https://corsproxy.io/?';
    const targetUrl = 'http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbbbyubbu1233001&itemIdType=ISBN&ItemId=9788967442088&output=js&Version=20131101&OptResult=ebookList,usedList,reviewList';
    
    return fetch(corsProxy + encodeURIComponent(targetUrl))
    .then(response => response.json());

}