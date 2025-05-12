import { useState } from 'react';
import styles from './AdminNoticeWriting.module.css';
function AdminNoticeWriting() {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setPreview(imageURL);
        }
    };
    return (
        <>
        <div className={styles.bigContainer}>
            <div className={styles.smallHeader}>
                <span className={styles.smallHeaderElement}>공지사항</span>
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
                    <img src={preview} alt="preview" className={styles.previewImage} />
                ) : (
                    <label htmlFor="imageUpload" className={styles.uploadLabel}>
                        img
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
                    <button className={styles.submit}>등록</button>
                    <button className={styles.cancel}>취소</button>
                </div>
            </div>
         </div>
        </>
    );
}

export default AdminNoticeWriting;
