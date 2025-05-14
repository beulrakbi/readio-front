import { useState } from 'react';
import eraserImg from '../../assets/UserDelete-eraser.png'; // 지우개 이미지 경로
import styles from './UserDelete.module.css';

function UserDelete() {
    const [agreed, setAgreed] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agreed) {
            setShowError(true);
        } else {
            setShowError(false);
            setShowModal(true);
            // 탈퇴 요청 처리 로직 추가하기
            console.log('Form submitted');
        }
    };

    const handleConfirmDelete = () => {
        setShowModal(false);
        // 탈퇴 버튼 누르면 비밀번호 확인 페이지로 가야됨
        console.log('탈퇴 요청이 완료되었습니다.');
    };

    const handleCancel = () => {
        setShowModal(false);
        console.log('탈퇴 요청이 취소되었습니다.');
    };



    return (
        <>
            <div className={styles.UserDeletePage}>
                <div className={styles.contentBox}>

                    <p className={styles.title}>&nbsp;&nbsp;&nbsp;회원 탈퇴</p>
                    <hr className={styles.hr} />
                    <p className={styles.description}>
                        &nbsp;&nbsp;&nbsp;회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.</p>

                    <div className={styles.termGroup}>
                        <p className={styles.terms}>
                            <a>✓</a> 사용하고 계신 아이디(user01)는 탈퇴할 경우 재사용 및 복구가 불가능합니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가하오니 신중하게 선택하시기 바랍니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;부정 가입 또는 부정 이용이 의심되는 아이디는 탈퇴 후 6개월간 동일한 실명정보로 재가입 할 수 없습니다.
                        </p>

                        <p className={styles.terms}>
                            <a>✓</a> 탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;회원정보 및 개인형 서비스 이용기록은 모두 삭제되며, 삭제된 데이터는 복구되지 않습니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;삭제되는 내용을 확인하시고 필요한 데이터는 미리 백업을 해주시기 바랍니다.<br />
                            <p className={styles.terms2}>
                                &nbsp;&nbsp;&nbsp;&nbsp;• 회원정보, 프로필 계정 삭제 <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;• 이용기록 -  '북마크'한 컨텐츠, '좋아요'한 컨텐츠, 감정기록, 등록된 관심정보, 팔로우/팔로잉 등 회원 이용 기록 삭제
                            </p>
                        </p>

                        <p className={styles.terms}>
                            <a>✓</a> 게시판형 서비스에 등록한 게시물 및 이용기록은 모두 삭제됩니다. <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;책 페이지, 포스트, Q&A 등에 올린 게시글 및 댓글은 탈퇴 시 자동 삭제 됩니다.<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;삭제 되는 내용을 확인 하시고, 필요한 데이터는 미리 백업을 해주시기 바랍니다.<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;탈퇴 후에는 회원정보가 삭제되어 본인 여부를 확인할 수 있는 방법이 없으므로 계정 및 게시글을 임의로 다시 복구해드릴 수 없습니다.<br />
                            <p className={styles.terms2}>
                                &nbsp;&nbsp;&nbsp;&nbsp;• 영상 - 영상에 대한 '북마크' 등 <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;• 책 - 책에 대한 '북마크' , 등록한 책 리뷰, 좋아요 등 <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;• 포스트 - 등록한 포스트, 포스트에 등록한 리뷰, 좋아요 등 <br />
                                &nbsp;&nbsp;&nbsp;&nbsp;• 게시판 - '좋아요'한 공지사항 등
                            </p>
                        </p>

                        <p className={styles.terms}>
                            <a>✓</a>  탈퇴 후에는 아이디 (user01) 로 다시 가입할 수 없으며, 아이디와 데이터는 복구할 수 없습니다. <br />
                        </p>
                    </div>
                    <div className={styles.checkBoxWrap}>
                        <div className={styles.checkBox}>
                            <input
                                type="checkbox"
                                id="agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <label htmlFor="agree">위 안내 사항을 모두 확인하였으며, 이에 동의합니다.</label>
                        </div>
                        {showError && (
                            <p className={styles.error}>안내 사항에 동의하셔야 탈퇴가 가능합니다.</p>
                        )};
                    </div>
                </div>
            </div>

            <div className={styles.submitBtnWrap}>
                <button type="submit" className={styles.submitBtn} onClick={handleSubmit}>탈퇴</button>
            </div>

            {showModal && (
                <div className={styles.modalWrap}>
                    <div className={styles.modalContent}>
                        <img src={eraserImg} alt="지우개" className={styles.eraserImg} />
                        <p className={styles.modalTitle}>정말 탈퇴하시겠습니까?</p>
                        <p className={styles.modalDescription}>탈퇴 후에는 계정이 삭제되며, <br/>복구가 불가합니다.</p>
                        <div className={styles.modalBtnWrap}>
                            <button className={styles.cancelBtn} onClick={handleCancel}>취소</button>
                            <button className={styles.confirmBtn} onClick={handleConfirmDelete}>탈퇴</button>
                        </div>
                    </div>
                </div>
            )};
        </>
    );
}

export default UserDelete;