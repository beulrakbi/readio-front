import { useState } from 'react';
import styles from './AdminEventWriting.module.css';

function AdminEventWriting() {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreview(imageURL);
            e.target.value="";
        }
    };

    const handleImageDelete = () => {
        setPreview(null);
    };

    return (
        <>
        <div className={styles.main}>
            <div className={styles.bigContainer}>
                <div className={styles.smallHeader}>
                    <span className={styles.smallHeaderElement}>소식</span>
                </div>

                <div className={styles.line}></div>

                <div className={styles.inputGroup}>
                    <input type="text" className={styles.titleInput} placeholder="제목을 입력하세요" />
                    <div className={styles.categoryButtons}>
                        <button>단기</button>
                        <button>긴급</button>
                        <button>종료</button>
                    </div>
                </div>

                <textarea className={styles.textarea} placeholder="내용을 입력해주세요" />

                <div className={styles.bottom}>
                    <div className={styles.imageUploadBox}>
                        {preview ? (
                            <div className={styles.previewWrapper}>
                                <img src={preview} alt="preview" className={styles.previewImage} />
                                <button className={styles.deleteImageBtn} onClick={handleImageDelete}>
                                    삭제
                                </button>
                            </div>
                            ) : (
                                <label htmlFor="imageUpload" className={styles.uploadLabel}>
                                    +img
                                </label>
                        )}
                        <input
                            type="file"
                            id="imageUpload"
                            className={styles.uploadInput}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={`${styles.submit} ${styles.actionButton}`}>등록</button>
                        <button className={`${styles.cancel} ${styles.actionButton}`}>취소</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default AdminEventWriting;
