import React from 'react';
import styles from './Calendar.module.css';

const emotions = [
    { label: '보통', emoji: '🙂' },
    { label: '기쁨', emoji: '😁' },
    { label: '슬픔', emoji: '😭' },
    { label: '화남', emoji: '😡' },
    { label: '불안', emoji: '😵‍💫' },
];

const EmotionModal = ({ onSelect, onCancel }) => {
    const [selected, setSelected] = React.useState(null);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>감정 등록</h2>
                <div className={styles.emotionGrid}>
                    {emotions.map((emotion) => (
                        <button
                            key={emotion.label}
                            className={`${styles.emotionButton} ${selected === emotion.emoji ? styles.selected : ''}`}
                            onClick={() => setSelected(emotion.emoji)}
                        >
                            {emotion.label}{emotion.emoji}
                        </button>
                    ))}
                </div>
                <div className={styles.buttonRow}>
                    <button className={styles.cancelBtn} onClick={onCancel}>취소</button>
                    <button
                        className={styles.confirmBtn}
                        onClick={() => {
                            if (selected) onSelect(selected);
                        }}
                    >
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmotionModal;
