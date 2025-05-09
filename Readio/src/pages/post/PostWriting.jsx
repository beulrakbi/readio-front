import PostWritingPhoto from '../../assets/PostWritingPhoto.png';
import PostWritingSize from '../../assets/PostWritingSize.png';
import PostWritingAlign from '../../assets/PostWritingAlign.png';
import PostWritingBook from '../../assets/PostWritingBook.png';
import PostWritingCSS from './PostWriting.module.css';


function PostWriting() {
    return (
        <div className={PostWritingCSS.postWritingDiv}>
            <div className={PostWritingCSS.iconDiv}>
                <button type='button' className={PostWritingCSS.iconBt}
                        onClick={''}>
                    <img src={PostWritingPhoto} className={PostWritingCSS.icon}/>
                </button>
                <button className={PostWritingCSS.iconBt}>
                    <img src={PostWritingSize} className={PostWritingCSS.icon}/>
                </button>
                <button className={PostWritingCSS.iconBt}>
                    <img src={PostWritingAlign} className={PostWritingCSS.icon}/>
                </button>
                <button className={PostWritingCSS.iconBt}>
                    <img src={PostWritingBook} className={PostWritingCSS.icon}/>
                </button>
                <button className={PostWritingCSS.postbt}>등록</button>
            </div>
            <input
                name='postTitle'
                placeholder='제목을 입력해주세요.'
                className={PostWritingCSS.postTitle}

            />
            <textarea
                name='PostContent'
                placeholder='내용을 입력해주세요.'
                className={PostWritingCSS.postContent}
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