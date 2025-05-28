import suspended from '../../assets/account-suspended.png';
import styles from './AccountSuspended.module.css';

function AccountSuspended () {
    return(
        <div className={styles.accountSuspendedWrapper}>
                <img src={suspended} alt="suspended" className={styles.suspendedImg}/>

                <p className={styles.warningTitle}>운영정책 위반<br/>
                서비스 이용제한 안내</p>

                <div className={styles.content}>
                    <p className={styles.textBox}>
                        고객님의 계정은 사이트 규정 위반으로 인해 정지되었습니다. <br />
                        자세한 문의사항은 고객센터(1222-5555)에 문의 부탁 드립니다. <br /><br />
                        감사합니다.
                    </p>
                </div>
        </div>
    )
}
export default AccountSuspended;