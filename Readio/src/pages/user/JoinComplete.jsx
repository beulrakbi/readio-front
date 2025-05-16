import { Link } from 'react-router-dom';
import logo from '../../assets/JoinComplete-logo.png';
import checkIcon from '../../assets/JoinComplete-check.png';
import menuIcon from '../../assets/JoinComplete-nav.png';
import styles from './JoinComplete.module.css'; // module import

function JoinComplete() {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <img src={logo} alt="logo" className={styles.logo} />
                <div className={styles.checkWrapper}>
                    <img src={checkIcon} alt="success" className={styles.checkimg} />
                </div>
                <h2 className={styles.title}>회원가입 완료</h2>
                <p className={styles.message}>
                    회원가입 내역 확인 및 수정은&nbsp;
                    <img src={menuIcon} alt="메뉴" className={styles.inlineIcon} />
                    &nbsp;&gt;&nbsp;
                   <span className={styles.highlight}>내 정보 수정</span>에서 가능합니다.
                </p>
            </div>

            <div className={styles.buttonGroup}>
                <Link to="/" className={styles.button}>메인으로 이동하기</Link>
                <Link to="/login" className={styles.button}>로그인하기</Link>
            </div>
        </div>
    );
}

export default JoinComplete;