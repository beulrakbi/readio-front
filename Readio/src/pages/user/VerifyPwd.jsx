import styles from './VerifyPwd.module.css';

function VerifyPwd() {
    return (
        <>
            <div className={styles.VerifyPwdPage}>
                <section className={styles.formSection}>
                    <div className={styles.contentBox}>
                        <hr className={styles.line1} />
                        <p className={styles.title}>비밀번호 확인</p>
                        <hr className={styles.line2} />
                        <p className={styles.description}>
                            소중한 정보보호를 위해, 비밀번호를 다시 입력해주세요.
                        </p>

                        <div className={styles.formGroup}>
                            <label>현재 비밀번호</label>
                            <input type="password" placeholder='비밀번호 입력' />
                        </div>
                    </div>
                </section>

                <div className={styles.submitBtnWrap}>
                    <button type="submit" className={styles.submitBtn}>확인</button>
                </div>
            </div>
            
        </>

    );
}
export default VerifyPwd;