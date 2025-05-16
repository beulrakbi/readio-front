import { useState } from 'react';
import styles from './faq.module.css';

function Faq() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.faqContainer}>
            <div className={styles.sortBox}>
                <span className={styles.smallHeaderElement}>FAQ 자주 묻는 질문</span>
            </div>

            <div className={styles.faqItem}>
                <div className={styles.faqQuestion}>
                    <span className={styles.questionTitle} onClick={() => toggleAnswer(0)}>Q1. 알고리즘이 이상해요!</span>
                </div>
                {openIndex === 0 && (
                    <div className={styles.faqAnswer}>
                        안녕하세요.<br />
                        리디오 관리자 채원입니다.<br />
                        우선 불편을 드려 죄송합니다.<br />
                        저희 알고리즘 담당자 수입 관리자님의 잘못입니다. 저는 잘못이 없습니다.
                    </div>
                )}
            </div>

            <div className={styles.faqItem}>
                <div className={styles.faqQuestion}>
                    <span className={styles.questionTitle} onClick={() => toggleAnswer(1)}>Q2. 회원가입 하면 좋은 점은 무엇인가요?</span>
                </div>
                {openIndex === 1 && (
                    <div className={styles.faqAnswer}>
                        회원가입 시 더 많은 기능과 맞춤 추천을 이용할 수 있습니다.
                    </div>
                )}
            </div>

            <div className={styles.faqItem}>
                <div className={styles.faqQuestion}>
                    <span className={styles.questionTitle} onClick={() => toggleAnswer(2)}>Q3. 영상에 대한 댓글을 작성 못하나요?</span>
                </div>
                {openIndex === 2 && (
                    <div className={styles.faqAnswer}>
                        영상은 댓글 작성이 불가능합니다.
                    </div>
                )}
            </div>

            <div className={styles.faqItem}>
                <div className={styles.faqQuestion}>
                    <span className={styles.questionTitle} onClick={() => toggleAnswer(3)}>Q4. 영상이 안나옵니다.</span>
                </div>
                {openIndex === 3 && (
                    <div className={styles.faqAnswer}>
                        영상 로딩 문제는 네트워크 상태를 확인하거나 고객센터로 문의해주세요.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Faq;
