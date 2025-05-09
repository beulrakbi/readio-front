import PostWritingCSS from './PostWriting.module.css';

function PostWritingBook() {
    return (
        <div className={PostWritingCSS.writingBookDiv}>
            <select className={PostWritingCSS.writingBook}>
                <option value={"book"}>도서명으로 검색</option>
                <option value={"author"}>저자명으로 검색</option>
            </select>
            <input type="text" placeholder='검색' className={PostWritingCSS.writingSearch}/>
            <li>책 정보 List</li>
        </div>
    )
}

export default PostWritingBook