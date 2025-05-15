import { useState } from 'react';
import styles from './Join.module.css';

function Join() {

    // 약관 동의 상태 관리 _모달 기능
    const [isTermsModalOpen, setTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);

    // 모달 핸들러
    const openTermsModal = () => setTermsModalOpen(true);
    const closeTermsModal = () => setTermsModalOpen(false);

    const openPrivacyModal = () => setPrivacyModalOpen(true);
    const closePrivacyModal = () => setPrivacyModalOpen(false);

    return (
        <div className={styles.joinPage}>
            {/* 회원정보 입력 */}
            <section className={styles.formSection}>
                <hr className={styles.line1} />
                <h2 className={styles.sectionTitle}>&nbsp;&nbsp;
                    회원정보 입력
                    <span className={styles.required}>(필수)</span>
                </h2>
                <hr className={styles.line2} />

                <div className={styles.formGroup}>
                    <label>이름</label>
                    <input type="text" placeholder="이름을 입력하세요" />
                </div>
                <div className={styles.formGroup}>
                    <label>아이디</label>
                    <input type="text" placeholder="아이디를 입력하세요" />
                    <button type="button" className={styles.checkBtn}>중복확인</button>
                </div>
                <div className={styles.formGroup}>
                    <label>비밀번호</label>
                    <input type="password" placeholder="비밀번호 입력" />
                </div>
                <div className={styles.formGroup}>
                    <label>비밀번호 확인</label>
                    <input type="password" placeholder="비밀번호 확인" />
                </div>
                <div className={styles.formGroup}>
                    <label>이메일</label>
                    <input type="email" placeholder="이메일을 입력하세요" />
                    <button type="button" className={styles.checkBtn}>중복확인</button>
                </div>
                <div className={styles.formGroup}>
                    <label>휴대폰 번호</label>
                    <input type="phone" placeholder="휴대폰 번호 입력" />
                    <button type="button" className={styles.checkBtn}>중복확인</button>
                </div>
                <div className={styles.formGroup}>
                    <label>생년월일</label>
                    <input type="date" />
                </div>
            </section>

            <hr className={styles.line1} />
            {/* 약관동의 */}
            <section className={styles.termsSection}>
                <h2 className={styles.sectionTitle}>약관동의</h2>


                <div className={styles.checkboxRow}>
                    <label><input type="checkbox" /> [필수] 사이트 이용약관 동의</label>
                    <button type="button" onClick={openTermsModal} className={styles.modalBtn}>
                        자세히보기
                    </button>
                </div>

                {isTermsModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3>[필수] 사이트 이용약관 동의</h3>
                            <div className={styles.modalBody}>
                                <p>이 약관은 주식회사 리디오(이하 “회사”)가 제공하는 맞춤형 플랫폼 서비스(이하 “서비스”)에 대한 이용계약을 체결한 이용자(이하 “회원”)의 서비스 이용조건 및 절차,
                                    회사와 회원의 권리와 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                                <p>보관 기간은 서비스 탈퇴 시까지입니다.</p>
                                <p>블라블라~~</p>

                            </div>
                            <button onClick={closeTermsModal} className={styles.closeBtn}>닫기</button>
                        </div>
                    </div>
                )}


                <div className={styles.checkboxGroup}>
                    <label><input type="checkbox" /> [필수] 개인정보 수집 및 이용 동의</label>
                    <button type="button" onClick={openPrivacyModal} className={styles.modalBtn}>
                        자세히 보기
                    </button>
                </div>

                {isPrivacyModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h3>개인정보 수집 및 이용 동의</h3>
                            <div className={styles.modalBody}>
                                <p>본인은 개인정보 수집 및 이용에 동의합니다. 수집 항목은 이름, 이메일, 휴대폰번호 등이며, 목적은 회원관리입니다.</p>
                                <p>보관 기간은 서비스 탈퇴 시까지입니다.</p>
                            </div>
                            <button onClick={closePrivacyModal} className={styles.closeBtn}>닫기</button>
                        </div>
                    </div>
                )}

                <div className={styles.checkboxGroup}>
                    <label><input type="checkbox" /> [선택] 마케팅 정보 수신 동의</label>
                </div>

                <div className={styles.checkboxGroup}>
                    <label><input type="checkbox" /> [선택] 제3자 정보 제공 동의</label>
                </div>
            </section>

            <hr className={styles.line1} />
            <div className={styles.submitBtnWrap}>
                <button type="submit" className={styles.submitBtn}>동의하고 가입하기</button>
            </div>
        </div>
    );
}
export default Join;