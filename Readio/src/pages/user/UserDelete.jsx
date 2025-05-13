import styles from './UserDelete.module.css';

function UserDelete() {
    return (
        <>
            <div className={styles.UserDeletePage}>
                <div className={styles.contentBox}>

                    <p className={styles.title}>회원 탈퇴</p>
                    <hr className={styles.hr} />
                    <p className={styles.description}>
                        회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.                    </p>

                    <div className={styles.termGroup}>
                        <p className={styles.terms}>
                            <a>✓</a> 사용하고 계신 아이디(user01)는 탈퇴할 경우 재사용 및 복구가 불가능합니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가하오니 신중하게 선택하시기 바랍니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;부정 가입 또는 부정 이용이 의심되는 아이디는 탈퇴 후 6개월간 동일한 실명정보로 재가입 할 수 없습니다.
                        </p>
                        <p className={styles.terms}>
                            <a>✓</a> 탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;회원정보 및 개인형 서비스 이용기록은 모두 삭제되며, 삭제된 데이터는 복구되지 않습니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;삭제되는 내용을 확인하시고 필요한 데이터는 미리 백업을 해주세요.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.submitBtnWrap}>
                <button type="submit" className={styles.submitBtn}>탈퇴</button>
            </div>
        </>
    );
}

export default UserDelete;