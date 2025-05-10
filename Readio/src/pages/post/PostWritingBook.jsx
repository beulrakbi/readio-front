import PostCSS from './Post.module.css';

function PostWritingBook() {
    return (
        <div className={PostCSS.writingBookDiv}>
            <select className={PostCSS.writingBook}>
                <option value={"book"}>도서명으로 검색</option>
                <option value={"author"}>저자명으로 검색</option>
            </select>
            <input type="text" placeholder='검색' className={PostCSS.writingSearch}/>
            <li>책 정보 List</li>
        </div>
    )
}

export default PostWritingBook