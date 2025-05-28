import { useEffect, useState } from 'react';
import styles from './faq.module.css';

function Faq() {
  const [faqList, setFaqList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/serviceCenter/faq/list')
      .then((res) => res.json())
      .then((data) => setFaqList(data))
      .catch((err) => console.error('Error fetching FAQ:', err));
  }, []);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <div className={styles.sortBox}>
        <span className={styles.smallHeaderElement}>FAQ 자주 묻는 질문</span>
      </div>

      {faqList.map((faq, index) => (
        <div className={styles.faqItem} key={faq.faqId}>
          <div className={styles.faqQuestion}>
            <span
              className={styles.questionTitle}
              onClick={() => toggleAnswer(index)}
            >
              {faq.faqTitle}
            </span>
          </div>
          {openIndex === index && (
            <div className={styles.faqAnswer}>
              {(faq.faqContent ?? '').split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Faq;
