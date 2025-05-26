import { callBookInsertAPI, callBooksAPI } from "./BookAPICalls";
import sample from "./testBook.json";

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

export function testBooksxxxx()
{
    const corsProxy = 'https://corsproxy.io/?';
    const targetUrl = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbbbyubbu1233001&Query=aladdin&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101';
    return fetch(corsProxy + encodeURIComponent(targetUrl))
    .then(response => response.json());
}

export function testBooks()
{
    return sample;
}



// --------------------------------------------------------------------------------------

export async function getBooksByKeyword(keyword, dispatch, page = 1, size = 10) {
    const result = await dispatch(callBooksAPI({ search: keyword, page, size }));
    if (result) return result;
}

export async function getNewBooks(keyword, dispatch, num) {
    const result = await dispatch(callBooksAPI({ search: keyword }));

    if (Array.isArray(result.item)) {
        const books = result.item.slice(0, num);
        for (let i = 0; i < books.length; i++) {
            const form = {
                title: books[i].title,
                author: books[i].author,
                publisher: books[i].publisher,
                description: books[i].description,
                cover: books[i].cover
            };
            dispatch(callBookInsertAPI({ form }));
        }
        return books;
    } else {
        console.error('책 검색 결과가 배열이 아닙니다:', result);
    }
}
