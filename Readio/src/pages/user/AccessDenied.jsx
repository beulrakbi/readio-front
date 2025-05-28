import { useNavigate } from 'react-router-dom';
import styles from './AccessDenied.module.css';

function AccessDenied() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    return (
        <div className={styles.accessContainer}>
            <h1 className={styles.accessTitle}>🚫 접근 권한이 없습니다</h1>
            <p className={styles.accessText}>이 페이지를 보려면 관리자 권한이 필요합니다.</p>
            <button onClick={goToHome} className={styles.accessButton}>
                홈으로 이동
            </button>
        </div>
    );
}
export default AccessDenied;