import React, { useState, useRef } from 'react';
import styles from './EditProfilePage.module.css';

const EditProfilePage = () => {
    const [previewImg, setPreviewImg] = useState(null);
    const fileInputRef = useRef(null);
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');

    const handleImageClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreviewImg(URL.createObjectURL(file));
    };

    const handleImageDelete = () => {
        setPreviewImg(null);
        fileInputRef.current.value = null;
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>&lt; 프로필 편집</h2>
            <div className={styles.profileCard}>
            <div className={styles.profileImageWrapper}>
                {previewImg ? (
                    <img src={previewImg} alt="프로필" className={styles.profileImage} />
                ) : (
                    <div className={styles.defaultProfile}></div>
                )}

                <div className={styles.imageBtns}>
                    <button onClick={handleImageClick} className={styles.imageBtn}>사진 수정</button>
                    <button onClick={handleImageDelete} className={styles.imageBtn}>사진 삭제</button>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            <label className={styles.label}>필명</label>
            <input
                type="text"
                className={styles.input}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />

            <label className={styles.label}>서재 소개</label>
            <textarea
                className={styles.textarea}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />

            <button className={styles.saveBtn}>저장하기</button>
        </div>
        </div>
    );
};

export default EditProfilePage;
