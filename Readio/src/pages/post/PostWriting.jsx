import PostWritingPhoto from '../../assets/PostWritingPhoto.png';
import PostWritingSize from '../../assets/PostWritingSize.png';
import PostWritingAlign from '../../assets/PostWritingAlign.png';
import PostWritingBook from '../../assets/PostWritingBook.png';
import PostCSS from './Post.module.css';


function PostWriting() {
    return (
        <div className={PostCSS.postWritingDiv}>
            <div className={PostCSS.iconDiv}>
                <button type='button' className={PostCSS.iconBt}
                        onClick={''}>
                    <img src={PostWritingPhoto} className={PostCSS.icon}/>
                </button>
                <button className={PostCSS.iconBt}>
                    <img src={PostWritingSize} className={PostCSS.icon}/>
                </button>
                <button className={PostCSS.iconBt}>
                    <img src={PostWritingAlign} className={PostCSS.icon}/>
                </button>
                <button className={PostCSS.iconBt}>
                    <img src={PostWritingBook} className={PostCSS.icon}/>
                </button>
                <button className={PostCSS.postbt}>등록</button>
            </div>
            <input
                name='postTitle'
                placeholder='제목을 입력해주세요.'
                className={PostCSS.postTitle}

            />
            <textarea
                name='PostContent'
                placeholder='내용을 입력해주세요.'
                className={PostCSS.postContent}
            >
            </textarea>
            {/* {selectedBook && (
            <div style={{ marginTop: "20px" }}>
                <h3>📚 선택한 책</h3>
            <BookInfo book={selectedBook} />
            </div>
            )} */}
        </div>
    )
}

export default PostWriting;