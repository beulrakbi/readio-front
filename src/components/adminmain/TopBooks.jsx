import { useEffect, useRef, useState } from "react";
import { testBooks } from "../../apis/BookAPI";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import AdminMainCSS from './adminmain.module.css';
import TopBook from "./TopBook";

function TopBooks()
{

    const [bookList, setBookList] = useState([]);

    useEffect(
        () => {
            // getVideos.then(data => setVideoList(data));
            // fetch(sample).then(data => setVideoList(data.items));
            setBookList(testBooks().item);
            console.log("booklist", bookList);
        }
    )

    const scrollRef = useRef();
    const leftButtonHandler = () => {
        scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
    
    const rightButtonHandler = () => {
        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }

    return (
        bookList &&
        <div className={AdminMainCSS.main}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>클릭 수 및 북마크가 많은 책</p>
            </div>
            <hr className={AdminMainCSS.csLine}/>
            <div className={AdminMainCSS.videoContainer}>
                <button className={AdminMainCSS.scrollButton} onClick={leftButtonHandler}><img className={AdminMainCSS.buttonImg} src={leftButton}/></button>
                <div className={AdminMainCSS.videoList} ref={scrollRef}>
                    {bookList.map(book => {return <TopBook key={book.isbn13} book={book}/>})}
                </div>
                <button className={AdminMainCSS.scrollButton} onClick={rightButtonHandler}><img className={AdminMainCSS.buttonImg} src={rightButton}/></button>
            </div>
            <hr className={AdminMainCSS.csLine}/>
        </div>
    )
}

export default TopBooks;