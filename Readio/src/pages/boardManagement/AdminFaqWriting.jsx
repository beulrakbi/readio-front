import { useState } from 'react';
import styles from './AdminFaqWriting.module.css';
function AdminFaqWriting() {
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
        <div className={styles.main}>
        <div className={styles.bigContainer}>
            <div className={styles.smallHeader}>
                <span className={styles.smallHeaderElement}>FAQ</span>
            </div>
            <div className={styles.line}></div>
            <div className={styles.inputGroup}>
                <input type="text" className={styles.titleInput} placeholder="제목을 입력하세요" />
            </div>

            <textarea className={styles.textarea} placeholder="내용을 입력해주세요" />

            <div className={styles.bottom}>
                <div className={styles.actionButtons}>
                    <button className={styles.submit}>등록</button>
                    <button className={styles.cancel}>취소</button>
                </div>
            </div>
         </div>
        </div>
        </>
    );
}

export default AdminFaqWriting;
