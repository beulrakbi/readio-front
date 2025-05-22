import { useEffect, useRef, useState } from 'react';
import PostWritingPhotoIcon from '../../assets/PostWritingPhoto.png';
import PostWritingBookIcon from '../../assets/PostWritingBook.png';
import PostCSS from './Post.module.css';
import PostWritingBook from './PostWritingBook';
import { replace, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { callPostCreateAPI } from '../../apis/PostAPICalls';

function PostWriting() {
    const dispatch = useDispatch();

    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const navigator = useNavigate();

    const [form, setForm] = useState({
        postTitle:'',
        postContent:'',
        bookIsbn:''
    });

    const [imageUrl, setImageUrl] = useState();

    const [selectedBook, setSelectedBook] = useState(null);
    const [isBookSearchOpen, setIsBookSearchOpen] = useState(false);

    /* 책 검색 */
    const handleToggleBookSearch = () => {
        setIsBookSearchOpen(prev => !prev);
    };
    /* 책 등록 */
    const handleBookSelectFromSearch = (book) => {
        setSelectedBook(book);
        setIsBookSearchOpen(false);
    };

    /* 등록 책 삭제 */
    const removeSelectedBook = () => {
        setSelectedBook(null);
    };

    /* 이미지 업로드 */
    const onChangeImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImageUrl({ file, previewUrl });
            e.target.value = '';
        }
    };

    /* 이미지 삭제 */
    const removeImage = () => {
        setImageUrl(null);
    };

    const onChangeHandler = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    });

    if (e.target.name === 'postContent' && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
};

    /* 게시글 등록 */
    const handleSubmit = () => {
        
        const formData = new FormData();

        formData.append('postTitle', form.postTitle);
        formData.append('postContent', form.postContent);
        formData.append('bookIsbn', selectedBook.title);

        if (imageUrl && imageUrl.file) {
            formData.append('postImage', imageUrl.file);
        }

        dispatch(
            callPostCreateAPI({
                form: formData
            })
        )
        console.log("postTitle:", formData.get('postTitle'));
        console.log("postContent:", formData.get('postContent'));
        console.log("bookIsbn:", formData.get('bookIsbn'));
        console.log("postImage:", formData.get('postImage'));
        alert('포스트 리스트로 이동합니다.');
        navigator('/mylibrary/postlist', { replace: true});
        window.location.reload();
    };

    return (
        <div className={PostCSS.postWritingDiv}>
            <div className={PostCSS.iconDiv}>
                <button type="button" className={PostCSS.iconBt} onClick={() => fileInputRef.current.click()}>
                    <img src={PostWritingPhotoIcon} className={PostCSS.icon} alt="Upload Photo" />
                </button>
                {/* <button type="button" className={PostCSS.iconBt}>
                    <img src={PostWritingSizeIcon} className={PostCSS.icon} alt="Adjust Size" />
                </button>
                <button type="button" className={PostCSS.iconBt}>
                    <img src={PostWritingAlignIcon} className={PostCSS.icon} alt="Adjust Align" />
                </button> */}
                <button type="button" className={PostCSS.iconBt} onClick={handleToggleBookSearch}>
                    <img src={PostWritingBookIcon} className={PostCSS.icon} alt="Search Book" />
                </button>
                <button type="button" className={PostCSS.postbt} onClick={handleSubmit}>등록</button>
            </div>

            <div className={PostCSS.postContentDiv}>
                <input
                    name='postTitle'
                    placeholder='제목을 입력해주세요.'
                    className={PostCSS.postTitle}
                    onChange={onChangeHandler}
                />
                <textarea
                    name="postContent"
                    placeholder="내용을 입력해주세요."
                    className={PostCSS.postContent}
                    ref={textareaRef}
                    onChange={onChangeHandler}
                    maxLength={2500}
                />
                <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={onChangeImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                {imageUrl && (
                    <div className={PostCSS.imagePreview}>
                        <img src={imageUrl.previewUrl} alt="미리보기" className={PostCSS.imagePreviewImg} />
                        <button type="button" className={PostCSS.removeBtn} onClick={removeImage}>X</button>
                    </div>
                )}

                {selectedBook && (
                    <div className={PostCSS.selectedBookPreview}>
                        <img
                            src={selectedBook.coverUrl || '기본표지경로.png'}
                            alt={selectedBook.title}
                            className={PostCSS.selectedBookCover}
                        />
                        <div className={PostCSS.selectedBookInfo}>
                            <p className={PostCSS.selectedBookTitle} dangerouslySetInnerHTML={{ __html: selectedBook.title }}></p>
                            <p className={PostCSS.selectedBookAuthor}>{selectedBook.author} </p>
                            {selectedBook.publisher && <p className={PostCSS.selectedBookPublisher}>출판사 : {selectedBook.publisher}</p>}
                        </div>
                        <button type="button" className={PostCSS.removeSelectedBookBtn} onClick={removeSelectedBook}>X</button>
                    </div>
                )}
            </div>

            {isBookSearchOpen && (
                <div className={PostCSS.bookSearchModalOverlay}>
                    <PostWritingBook
                        onBookSelect={handleBookSelectFromSearch}
                        onClose={() => setIsBookSearchOpen(false)}
                        PostCSS={PostCSS}
                    />
                </div>
            )}
        </div>
    );
}

export default PostWriting;