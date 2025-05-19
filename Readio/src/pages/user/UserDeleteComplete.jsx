import { Link } from 'react-router-dom';
import checkIcon from '../../assets/UserDeleteComplete-check.png';
import logo from '../../assets/UserDeleteComplete-logo.png';
import styles from './UserDeleteComplete.module.css'; // module import

function UserDeleteComplete() {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <img src={logo} alt="logo" className={styles.logo} />
                <div className={styles.checkWrapper}>
                    <img src={checkIcon} alt="success" className={styles.checkimg} />
                </div>
                <h2 className={styles.title}>회원탈퇴 완료</h2>
                <p className={styles.message}>
                    READIO를 이용해주시고 사랑해주셔서 감사합니다. <br/>
                    언제든 마음이 닿는 날, 다시 찾아와주세요. :)
                </p>

            </div>

            <div className={styles.buttonGroup}>
                <Link to="/" className={styles.button}>메인으로 이동하기</Link>
            </div>
        </div>
    );
}

export default UserDeleteComplete;