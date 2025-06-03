import { useEffect, useRef, useState } from 'react';
import PostWritingPhotoIcon from '../../assets/PostWritingPhoto.png';
import PostWritingBookIcon from '../../assets/PostWritingBook.png';
import PostCSS from './Post.module.css';
import PostWritingBook from './PostWritingBook';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchAladinBooks } from '../../modules/postwriting/bookSearchThunk';

import { callPostDetailAPI, callPostCreateAPI, callPostUpdateAPI } from '../../apis/PostAPICalls';

function PostWriting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postId } = useParams();

    const isEditMode = !!postId;

    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const postToEdit = useSelector(state => state.postReducer);

    const [form, setForm] = useState({
        postTitle:'',
        postContent:'',
    });

    const [imageUrl, setImageUrl] = useState();
    const [currentImagePreview, setCurrentImagePreview] = useState(null);
    const [isExistingImage, setIsExistingImage] = useState(false);

    const [selectedBook, setSelectedBook] = useState(null);
    const [isBookSearchOpen, setIsBookSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    // --- Redux 스토어의 postToEdit 변경 시 폼 데이터 채우기 (수정 모드) ---
    useEffect(() => {
        if (isLoading && isEditMode && postToEdit && postToEdit.postId === parseInt(postId)) {
            console.log("[PostWriting] postToEdit 변경 감지, 폼 데이터 설정:", postToEdit);
            setForm({
                postTitle: postToEdit.postTitle || '',
                postContent: postToEdit.postContent || '',
            });

            if (postToEdit.bookIsbn) {
                console.log(`[PostWriting] 저장된 ISBN으로 책 정보 조회 시작: ${postToEdit.bookIsbn}`);
                const fetchBookInfoFromAladin = async (isbn) => {
                    try {
                        const result = await dispatch(searchAladinBooks({ query: isbn, searchType: 'ISBN' })).unwrap();

                        if (result.items && result.items.length > 0) {
                            const book = result.items[0];
                            const newSelectedBook = {
                                isbn: book.isbn,
                                title: book.title,
                                author: book.author,
                                publisher: book.publisher,
                                coverUrl: book.coverUrl
                            };
                            setSelectedBook(newSelectedBook);
                            console.log("[PostWriting] ISBN으로 책 정보 로드 성공 (Aladin API):", newSelectedBook);
                        } else {
                            console.log("[PostWriting] 알라딘 API에서 해당 ISBN으로 책 정보를 찾을 수 없습니다.");
                            setSelectedBook(null); // 찾지 못하면 책 정보 초기화
                        }
                    } catch (error) {
                        console.error("[PostWriting] ISBN으로 책 정보 로드 실패 (Aladin API):", error);
                        setSelectedBook(null);
                    }
                };
                if (!selectedBook || selectedBook.isbn !== postToEdit.bookIsbn) {
                    fetchBookInfoFromAladin(postToEdit.bookIsbn);
                }
            } else {
                console.log("[PostWriting] 게시물에 저장된 ISBN 정보가 없습니다.");
                setSelectedBook(null);
            }
            if (postToEdit.postImg && postToEdit.postImg.saveName && !imageUrl && !isExistingImage) {
                setCurrentImagePreview(postToEdit.postImg.saveName);
            } else if (!postToEdit.postImg?.saveName && !imageUrl) {
                setCurrentImagePreview(null);
            }
            setIsLoading(false);
        } else if (!isEditMode && !isLoading) {
            setIsLoading(false);
        }
    }, [isLoading, isEditMode, postToEdit, postId, imageUrl, isExistingImage, selectedBook, dispatch]);

    /* 책 검색 */
    const handleToggleBookSearch = () => {
        setIsBookSearchOpen(prev => !prev);
    };
    /* 책 등록 */
    const handleBookSelectFromSearch = (book) => {
        const newSelectedBook = {
            isbn: book.isbn,
            title: book.title,
            author: Array.isArray(book.authors) ? book.authors.join(', ') : book.authors,
            publisher: book.publisher,
            coverUrl: book.thumbnail 
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
        if (isEditMode && postToEdit?.postImg?.saveName) {
            setCurrentImagePreview(postToEdit.postImg.saveName);
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
        if (!form.postTitle.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!form.postContent.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        // 책과 이미지는 선택 사항이므로, 여기서 필수 검증 제거

        const submissionFormData = new FormData();
        submissionFormData.append('postTitle', form.postTitle);
        submissionFormData.append('postContent', form.postContent);

        // 책 정보 추가 (선택 사항)
        if (selectedBook && selectedBook.isbn) {
            // ISBN 값 정제 (예: "ISBN13:1234567890123" -> "1234567890123")
            // 실제 selectedBook.isbn 값의 형식에 따라 정제 로직 조정 필요
            const isbnValue = selectedBook.isbn.split(' ').pop(); // 가장 마지막 부분(숫자)만 사용 시도
            submissionFormData.append('bookIsbn', isbnValue);
            console.log("[PostWriting] 전송될 bookIsbn:", isbnValue);
        } else {
            submissionFormData.append('bookIsbn', ''); // 책 선택 안 함 또는 삭제 시 빈 문자열 전송
            console.log("[PostWriting] 책 정보 없이 전송 (bookIsbn: '')");
        }

        // 이미지 정보 추가 (선택 사항)
        if (imageUrl && imageUrl.file) { // 1. 새 이미지가 선택된 경우
            submissionFormData.append('postImage', imageUrl.file);
            console.log("[PostWriting] 새 이미지 파일 첨부:", imageUrl.file.name);
        } else if (isEditMode && isExistingImage) { // 2. 수정 모드이고, 기존 이미지를 삭제하기로 한 경우
            submissionFormData.append('deleteExistingImage', 'true'); // 삭제 플래그 전송 (백엔드와 약속 필요)
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
                // callPostUpdateAPI는 createAsyncThunk가 아니므로 .unwrap() 사용 불가.
                // Promise를 await로 직접 처리합니다.
                const result = dispatch(callPostUpdateAPI({ postId: parseInt(postId), form: submissionFormData }));
                
                alert('게시물이 성공적으로 수정되었습니다.');
                navigate(`/mylibrary/post/${postId}`);

            } else {
                // === 작성 모드 ===
                console.log("[PostWriting] 생성 API 호출 준비");
                // callPostCreateAPI는 createAsyncThunk가 아니므로 .unwrap() 사용 불가.
                // Promise를 await로 직접 처리합니다.
                const result = dispatch(callPostCreateAPI({ form: submissionFormData }));
                
                alert('게시물이 성공적으로 등록되었습니다.');
                const newPostId = result?.data?.postId || result?.postId;
                if (newPostId) {
                    navigate(`/mylibrary/post/${newPostId}`);
                } else {
                    navigate('/mylibrary/postlist', { replace: true });
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
                             src={selectedBook.coverUrl || defaultImg} // 기본 이미지 경로
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