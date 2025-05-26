import { NavLink } from 'react-router-dom';
import styles from './UserEdit.module.css';

function UserEdit() {

    return (
        <div className={styles.UserEditPage}>
            {/* 입력된 회원정보 */}
            <section className={styles.formSection}>
                <hr className={styles.line1} />
                <h2 className={styles.sectionTitle}>&nbsp;&nbsp;
                    회원정보 수정
                </h2>
                <hr className={styles.line2} />

                <div className={styles.formGroup}>
                    <label>이름</label>
                    <input type="text" placeholder="이름을 입력하세요" />
                </div>
                <div className={styles.formGroup}>
                    <label>아이디</label>
                    <input type="text" placeholder="아이디를 입력하세요" />
                    {/* <button type="button" className={styles.checkBtn}>중복확인</button> */}
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

            {/* 약관동의 */}
            <hr className={styles.line1} />
            <section className={styles.termsSection}>
                <p className={styles.description}>
                    • 회원탈퇴 후 동일 아이디로 재가입이 불가합니다.
                    <NavLink to={"/users/verify-pwd"} className={styles.deleteAccount}>회원탈퇴 &gt;
                    </NavLink>
                </p>
            </section>

            <div className={styles.submitBtnWrap}>
                <button type="submit" className={styles.cancelBtn}>취소</button>
                <button type="submit" className={styles.submitBtn}>수정</button>
            </div>
        </div>
    );
}
export default UserEdit;