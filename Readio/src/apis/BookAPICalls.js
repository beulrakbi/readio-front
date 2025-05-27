import { getBooks, postBook } from "../components/book/BookSlice";

const BASE_URL = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx";
const TTB_KEY = "ttbehfvls09271435001"; 
// 알라딘 API key => ttbehfvls09271435001

export const callBooksAPI = ({search, page = 1, size = 10}) => {
    const start = (page - 1) * size + 1;
    const requestURL = `${BASE_URL}?ttbkey=${TTB_KEY}&Query=${encodeURIComponent(search)}&QueryType=Title&MaxResults=10&SearchTarget=Book&output=js`;

    return async (dispatch, getState) => {
        const response = await fetch(requestURL);
        const result = await response.json();

        console.log(`[BookAPICalls] callBooksAPI result : `, result);
        if(result.item) {
            dispatch(getBooks(result)); // import문 필요
            return result;
        }
    };
};

export const callBookInsertAPI = ({form}) => {
    // const requestURL = `http://localhost:8080/`;

    return async (dispatch, getState) => {
        const response = await fetch(requestURL, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                Accept : '*/*',
            },
            body : JSON.stringify(form),
        });

        const result = await response.json();
        if(result.status === 200) {
            dispatch(postBook(form)); // import문 필요
        }
    }
}