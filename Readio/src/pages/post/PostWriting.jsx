// src/components/PostWriting.js
import { useRef, useState } from 'react';
import PostWritingPhotoIcon from '../../assets/PostWritingPhoto.png';
import PostWritingSizeIcon from '../../assets/PostWritingSize.png';
import PostWritingAlignIcon from '../../assets/PostWritingAlign.png';
import PostWritingBookIcon from '../../assets/PostWritingBook.png';
import PostCSS from './Post.module.css';
import PostWritingBook from './PostWritingBook';

function PostWriting() {
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [selectedBook, setSelectedBook] = useState(null);
    const [isBookSearchOpen, setIsBookSearchOpen] = useState(false);

    const handleToggleBookSearch = () => {
        setIsBookSearchOpen(prev => !prev);
    };

    const handleBookSelectFromSearch = (book) => {
        setSelectedBook(book);
        setIsBookSearchOpen(false);
    };

    const removeSelectedBook = () => {
        setSelectedBook(null);
    };

    const handleTextareaInput = (e) => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
        setContent(e.target.value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImage({ file, previewUrl });
            e.target.value = '';
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleSubmit = () => {
        const postData = {
            title,
            content,
            imageFile: image ? image.file : null,
            bookInfo: selectedBook,
        };
        console.log("등록할 데이터:", postData);
        alert("게시글 등록 로직을 여기에 구현합니다.");
    };

    return (
        <div className={PostCSS.postWritingDiv}>
            <div className={PostCSS.iconDiv}>
                <button type="button" className={PostCSS.iconBt} onClick={() => fileInputRef.current.click()}>
                    <img src={PostWritingPhotoIcon} className={PostCSS.icon} alt="Upload Photo" />
                </button>
                <button type="button" className={PostCSS.iconBt}>
                    <img src={PostWritingSizeIcon} className={PostCSS.icon} alt="Adjust Size" />
                </button>
                <button type="button" className={PostCSS.iconBt}>
                    <img src={PostWritingAlignIcon} className={PostCSS.icon} alt="Adjust Align" />
                </button>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    name="PostContent"
                    placeholder="내용을 입력해주세요."
                    className={PostCSS.postContent}
                    ref={textareaRef}
                    value={content}
                    onInput={handleTextareaInput}
                    maxLength={2500}
                />
                <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />

                {image && (
                    <div className={PostCSS.imagePreview}>
                        <img src={image.previewUrl} alt="미리보기" className={PostCSS.imagePreviewImg} />
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