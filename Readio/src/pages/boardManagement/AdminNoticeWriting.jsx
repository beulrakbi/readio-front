import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './AdminNoticeWriting.module.css';

function AdminNoticeWriting() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [noticeState, setNoticeState] = useState('TEMPORARY');
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const navigate = useNavigate();
    const { noticeId } = useParams();

    // 수정 모드면 기존 데이터 불러오기
    useEffect(() => {
        if (noticeId) {
            fetch(`http://localhost:8080/serviceCenter/notice/detail/${noticeId}`)
                .then((res) => {
                    if (!res.ok) throw new Error('공지사항 조회 실패');
                    return res.json();
                })
                .then((data) => {
                    setTitle(data.noticeTitle || '');
                    setContent(data.noticeContent || '');
                    setNoticeState(data.noticeState || 'TEMPORARY');
                    if (data.noticeImg?.savedName) {
                        setPreview(`http://localhost:8080/uploads/${data.noticeImg.savedName}`);
                    }
                })
                .catch((err) => {
                    alert('공지사항을 불러오는 중 오류가 발생했습니다.');
                    navigate('/admin/notice');
                });
        }
    }, [noticeId, navigate]);

    // 이미지 선택 시 미리보기
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
            e.target.value = '';
        }
    };

    const handleImageDelete = () => {
        setPreview(null);
        setImageFile(null);
    };

    // 등록 또는 수정 제출
    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        // FormData 쓰는 경우도 있지만, 지금은 JSON만 보내는 예시입니다.
        // 이미지 업로드 기능을 완성하려면 별도의 API가 필요합니다.

        const data = {
            noticeId: noticeId ? Number(noticeId) : 0,
            noticeTitle: title,
            noticeContent: content,
            noticeState: noticeState,
            // 이미지 처리 관련 백엔드에 맞게 조정 필요
            noticeImg: imageFile
                ? {
                    originalName: imageFile.name,
                    savedName: imageFile.name // 서버에서 저장 처리 필요
                }
                : null,
        };

        try {
            const url = noticeId
                ? 'http://localhost:8080/serviceCenter/notice/update'
                : 'http://localhost:8080/serviceCenter/notice/write';

            const method = noticeId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('서버 오류');

            const resultText = await response.text();
            alert(resultText);
            navigate('/admin/notice');
        } catch (error) {
            console.error(error);
            alert('공지사항 등록/수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>공지사항 {noticeId ? '수정' : '등록'}</span>
                </div>

                <div className={styles.line}></div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        className={styles.titleInput}
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className={styles.categoryButtons}>
                        <button
                            onClick={() => setNoticeState('TEMPORARY')}
                            className={noticeState === 'TEMPORARY' ? styles.activeButton : ''}
                            type="button"
                        >
                            단기
                        </button>
                        <button
                            onClick={() => setNoticeState('URGENT')}
                            className={noticeState === 'URGENT' ? styles.activeButton : ''}
                            type="button"
                        >
                            긴급
                        </button>
                        <button
                            onClick={() => setNoticeState('CLOSED')}
                            className={noticeState === 'CLOSED' ? styles.activeButton : ''}
                            type="button"
                        >
                            종료
                        </button>
                    </div>
                </div>

                <textarea
                    className={styles.textarea}
                    placeholder="내용을 입력해주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className={styles.bottom}>
                    <div className={styles.imageUploadBox}>
                        {preview ? (
                            <div className={styles.previewWrapper}>
                                <img src={preview} alt="preview" className={styles.previewImage} />
                                <button className={styles.deleteImageBtn} type="button" onClick={handleImageDelete}>
                                    삭제
                                </button>
                            </div>
                        ) : (
                            <>
                                <label htmlFor="imageUpload" className={styles.uploadLabel}>+img</label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    className={styles.uploadInput}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </>
                        )}
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            onClick={handleSubmit}
                            className={`${styles.submit} ${styles.actionButton}`}
                            type="button"
                        >
                            {noticeId ? '수정' : '등록'}
                        </button>
                        <button
                            className={`${styles.cancel} ${styles.actionButton}`}
                            type="button"
                            onClick={() => navigate('/admin/notice')}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminNoticeWriting;
