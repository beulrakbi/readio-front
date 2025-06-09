import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PostWritingBookIcon from '../../assets/PostWritingBook.png';
import PostWritingPhotoIcon from '../../assets/PostWritingPhoto.png';
import PostCSS from './Post.module.css';
import PostWritingBook from './PostWritingBook';

import { callPostCreateAPI, callPostDetailAPI, callPostUpdateAPI } from '../../apis/PostAPICalls';

function PostWriting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postId } = useParams();

    const { isLogin } = useSelector(state => state.user);
    const userRole = useSelector(state => state.user.userInfo?.userRole);  // 추가

    const isEditMode = !!postId;

    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const postDetailFromStore = useSelector(state => state.postReducer.postDetail);

    const [form, setForm] = useState({
        postTitle: '',
        postContent: '',
    });

    const [imageUrl, setImageUrl] = useState();
    const [currentImagePreview, setCurrentImagePreview] = useState(null);
    const [isExistingImage, setIsExistingImage] = useState(false);

    const [selectedBook, setSelectedBook] = useState(null);
    const [isBookSearchOpen, setIsBookSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 로그인 여부 및 권한 확인 후 접근 제한 처리
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    // 권한이 없는 경우 접근 불가 페이지로 리다이렉트
    useEffect(() => {
        if (!isLogin) {
            console.log("[PostWriting] 로그인 상태가 아닙니다. 리다이렉트 실행.");
            navigate('/users/login', { replace: true });
        } else if (userRole && userRole === 'SUSPENDED') {
            alert("접근 권한이 없습니다.");
            navigate('/access-denied', { replace: true });
        }
    }, [isLogin, userRole, navigate]);

    // --- 수정 모드: 기존 데이터 로드 ---
    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true);
            console.log(`[PostWriting] 수정 모드 진입. postId: ${postId}`);
            dispatch(callPostDetailAPI({ postId: parseInt(postId) }))
                .then((originalPostData) => {
                    console.log("[PostWriting] 수정할 게시물 데이터 API 호출 요청 완료. 결과:", originalPostData);
                })
                .catch(error => {
                    console.error("[PostWriting] 수정할 게시물 정보 로드 실패:", error);
                    alert("게시물 정보를 불러오는 데 실패했습니다: " + (error.message || '알 수 없는 오류'));
                    navigate(-1);
                })
                .finally(() => {
                });
        } else {
            // 작성 모드: 상태 초기화
            setForm({ postTitle: '', postContent: '' });
            setSelectedBook(null);
            setImageUrl(null);
            setCurrentImagePreview(null);
            setIsExistingImage(false);
            setIsLoading(false);
        }
    }, [dispatch, postId, isEditMode, navigate]);

    useEffect(() => {
        if (isEditMode && postDetailFromStore && String(postDetailFromStore.postId) === String(postId)) {
            setForm({
                postTitle: postDetailFromStore.postTitle || '',
                postContent: postDetailFromStore.postContent || '',
            });

            if (postDetailFromStore.bookDetails && postDetailFromStore.bookDetails.bookIsbn) {
                console.log(`[PostWriting] 저장된 책 정보로 selectedBook 설정: ${postDetailFromStore.bookDetails.bookIsbn}`);
                setSelectedBook({
                    isbn: postDetailFromStore.bookDetails.bookIsbn,
                    title: postDetailFromStore.bookDetails.bookTitle,
                    author: postDetailFromStore.bookDetails.bookAuthor,
                    publisher: postDetailFromStore.bookDetails.bookPublisher,
                    coverUrl: postDetailFromStore.bookDetails.bookCover
                });
            } else {
                console.log("[PostWriting] 게시물에 저장된 책 정보가 없습니다.");
                setSelectedBook(null);
            }

            if (postDetailFromStore.postImg && postDetailFromStore.postImg.saveName) {
                const imageUrlFromBackend = `http://localhost:8080/img/post/${postDetailFromStore.postImg.saveName}`;
                setCurrentImagePreview(imageUrlFromBackend);
                setIsExistingImage(true);
                setImageUrl(null);
            } else {
                setCurrentImagePreview(null);
                setIsExistingImage(false);
            }
            setIsLoading(false);
        } else if (isEditMode && postDetailFromStore === null && !isLoading) {
            // 빈 블록
        } else if (!isEditMode && !isLoading) {
            setIsLoading(false);
        }
    }, [isLoading, isEditMode, postDetailFromStore, postId, dispatch]);

    /* 책 검색 */
    const handleToggleBookSearch = () => {
        setIsBookSearchOpen(prev => !prev);
    };
    /* 책 등록 */
    const handleBookSelectFromSearch = (book) => {
        const newSelectedBook = {
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            coverUrl: book.coverUrl
        };
        setSelectedBook(newSelectedBook);
        setIsBookSearchOpen(false);
        console.log("[PostWriting] 선택된 책:", newSelectedBook);
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
            setCurrentImagePreview(null);
            setIsExistingImage(false);
            e.target.value = '';
        }
    };

    /* 이미지 삭제 */
    const removeNewImagePreview = () => {
        if (imageUrl && imageUrl.previewUrl) {
            URL.revokeObjectURL(imageUrl.previewUrl);
        }
        setImageUrl(null);
        if (isEditMode && postDetailFromStore?.postImg?.saveName) {
            setCurrentImagePreview(postDetailFromStore.postImg.saveName);
        }
    };

    const handleRemoveExistingImage = () => {
        setCurrentImagePreview(null);
        setIsExistingImage(true);
        setImageUrl(null);
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));

        if (e.target.name === 'postContent' && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.style.height = 'auto'; // 높이 초기화 후 내용에 맞게 다시 조절
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    /* 게시글 등록 */
    const handleSubmit = async () => {
        if (!isLogin) {
            alert("로그인이 필요합니다.");
            navigate('/login', { replace: true });
            return;
        }

        if (!form.postTitle.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!form.postContent.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        const submissionFormData = new FormData();
        submissionFormData.append('postTitle', form.postTitle);
        submissionFormData.append('postContent', form.postContent);

        // 책 정보 추가
        if (selectedBook && selectedBook.isbn) {
            const isbnValue = selectedBook.isbn.split(' ').pop();
            submissionFormData.append('bookIsbn', isbnValue);
            console.log("[PostWriting] 전송될 bookIsbn:", isbnValue);
        } else {
            submissionFormData.append('bookIsbn', '');
            console.log("[PostWriting] 책 정보 없이 전송 (bookIsbn: '')");
        }

        // 이미지 정보 추가
        if (imageUrl && imageUrl.file) {
            submissionFormData.append('postImage', imageUrl.file);
            console.log("[PostWriting] 새 이미지 파일 첨부:", imageUrl.file.name);
        } else if (isEditMode && isExistingImage) {
            submissionFormData.append('deleteExistingImage', 'true');
            console.log("[PostWriting] 기존 이미지 삭제 플래그 전송");
        }

        console.log("[PostWriting] 최종 FormData 내용:");
        for (let [key, value] of submissionFormData.entries()) {
            console.log(key, value instanceof File ? value.name : value);
        }

        try {
            if (isEditMode) {
                // === 수정 모드 ===
                submissionFormData.append('postId', postId);
                console.log(`[PostWriting] 수정 API 호출 준비 (postId: ${postId})`);
                await dispatch(callPostUpdateAPI({ postId: parseInt(postId), form: submissionFormData }));

                alert('게시물이 성공적으로 수정되었습니다.');
                navigate(`/mylibrary/post/${postId}`);

            } else {
                // === 작성 모드 ===
                console.log("[PostWriting] 생성 API 호출 준비");
                const resultAction = await dispatch(callPostCreateAPI({ form: submissionFormData }));

                alert('게시물이 성공적으로 등록되었습니다.');
                const newPostId = resultAction?.payload?.data?.postId || resultAction?.payload?.postId || resultAction?.data?.postId || resultAction?.postId;
                if (newPostId) {
                    navigate(`/mylibrary/post/${newPostId}`);
                } else {
                    navigate('/mylibrary/postAndReview', { replace: true });
                }
            }
        } catch (error) {
            console.error("게시물 처리 실패:", error);
            alert(error.message || "게시물 생성에 실패했습니다.");
        }
    };

    if (isLoading && isEditMode) {
        return <div className={PostCSS.loadingContainer}><p>게시물 정보를 불러오는 중...</p></div>;
    }

    return (
        <div className={PostCSS.postWritingDiv}>
            <h2 className={PostCSS.pageTitle}>{isEditMode ? "포스트 수정" : "포스트 작성"}</h2>

            <div className={PostCSS.iconDiv}>
                <button type="button" className={PostCSS.iconBt} onClick={() => fileInputRef.current.click()}>
                    <img src={PostWritingPhotoIcon} className={PostCSS.icon} alt="사진 올리기" />
                </button>
                <button type="button" className={PostCSS.iconBt} onClick={handleToggleBookSearch}>
                    <img src={PostWritingBookIcon} className={PostCSS.icon} alt="책 검색" />
                </button>
                <button type="button" className={PostCSS.postbt} onClick={handleSubmit}>
                    {isEditMode ? "수정" : "등록"}
                </button>
            </div>

            <div className={PostCSS.postContentDiv}>
                <input
                    name='postTitle'
                    placeholder='제목을 입력해주세요.'
                    className={PostCSS.postTitle}
                    onChange={onChangeHandler}
                    value={form.postTitle}
                />
                <textarea
                    name="postContent"
                    placeholder="내용을 입력해주세요."
                    className={PostCSS.postContent}
                    ref={textareaRef}
                    onChange={onChangeHandler}
                    value={form.postContent}
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

                {/* 새로 선택한 이미지 미리보기 */}
                {imageUrl && imageUrl.previewUrl && (
                    <div className={PostCSS.imagePreview}>
                        <img src={imageUrl.previewUrl} alt="새 이미지 미리보기" className={PostCSS.imagePreviewImg} />
                        <button type="button" className={PostCSS.removeBtn} onClick={removeNewImagePreview}>X</button>
                    </div>
                )}
                {/* 수정 모드에서 기존 이미지 미리보기 (새 이미지 선택 안했을 때) */}
                {!imageUrl && currentImagePreview && isEditMode && (
                    <div className={PostCSS.imagePreview}>
                        <img src={currentImagePreview} className={PostCSS.imagePreviewImg} />
                        {/* 기존 이미지 삭제 버튼 UI (필요 시 추가) */}
                        <button type="button" className={PostCSS.removeBtn} onClick={handleRemoveExistingImage} title="기존 이미지 삭제">x</button>
                    </div>
                )}

                {/* 선택된 책 정보 표시 */}
                {selectedBook && (
                    <div className={PostCSS.selectedBookPreview}>
                        <img
                            src={selectedBook.coverUrl} // 기본 이미지 경로
                            alt={selectedBook.title}
                            className={PostCSS.selectedBookCover}
                        />
                        <div className={PostCSS.selectedBookInfo}>
                            <p className={PostCSS.selectedBookTitle}>{selectedBook.title}</p>
                            <p className={PostCSS.selectedBookAuthor}>{selectedBook.author}</p>
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
                        PostCSS={PostCSS} // PostCSS 객체 전달
                    />
                </div>
            )}
        </div>
    );
}

export default PostWriting;