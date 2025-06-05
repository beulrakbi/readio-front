import { useEffect, useRef, useState } from "react";
import leftButton from "../../assets/arrow-left.png";
import rightButton from "../../assets/arrow-right.png";
import AdminMainCSS from './adminmain.module.css';
import TopBook from "./TopBook";
import { Link } from "react-router-dom";
import { getClickAnalytics } from "../../apis/StatisticsAPICalls.js";

function TopBooks() {
    const [bookList, setBookList] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchTopBooks = async () => {
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);

            const format = (d) => d.toISOString().slice(0, 10);

            try {
                const rawData = await getClickAnalytics({
                    type: 'book',
                    sort: 'click',
                    startDate: format(oneWeekAgo),
                    endDate: format(today),
                    limit: 10
                });

                console.log("TopBooks 응답:", rawData);

                const topBooks = rawData.list || [];

                if (Array.isArray(topBooks)) {
                    setBookList(topBooks);
                } else {
                    console.error("TopBooks 응답이 list 배열 아님:", topBooks);
                }
            } catch (e) {
                console.error("TopBooks 불러오기 실패", e);
            }
        };

        fetchTopBooks();
    }, []);


    const leftButtonHandler = () => scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    const rightButtonHandler = () => scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });

    return (
        <div className={AdminMainCSS.main2}>
            <div className={AdminMainCSS.fontContainer}>
                <p className={AdminMainCSS.font1}>최근 일주일 클릭 수 Top10 책</p>
                <Link to="/admin/analytics/clicklog" className={AdminMainCSS.linkFont}>더보기 &gt;</Link>
            </div>
            <hr className={AdminMainCSS.csLine2} />
            <div className={AdminMainCSS.videoContainer}>
                <button className={AdminMainCSS.scrollButton} onClick={leftButtonHandler}>
                    <img className={AdminMainCSS.buttonImg} src={leftButton} alt="왼쪽" />
                </button>
                <div className={AdminMainCSS.videoList} ref={scrollRef}>
                    {bookList.map((book, idx) => (
                        <TopBook key={book.contentId || idx} book={book} />
                    ))}
                </div>
                <button className={AdminMainCSS.scrollButton} onClick={rightButtonHandler}>
                    <img className={AdminMainCSS.buttonImg} src={rightButton} alt="오른쪽" />
                </button>
            </div>
            <hr className={AdminMainCSS.csLine2} />
        </div>
    );
}

export default TopBooks;
