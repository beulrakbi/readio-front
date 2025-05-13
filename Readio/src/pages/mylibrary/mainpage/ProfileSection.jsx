import React from 'react';
import styles from './MyLibrary.module.css';
import profileImg from '../../../assets/cat1.jpg'
import pencilIcon from '../../../assets/pencil.png'

const ProfileSection = () => {
    return (
        <>
        <div className={styles.profileCard}>
            <div className={styles.profileImageWrapper}>
                <img src={profileImg} alt="프로필 이미지" className={styles.profileImage} />
                <img src={pencilIcon} alt="수정 아이콘" className={styles.editIcon} />
            </div>
            <div className={styles.profileInfo}>
                <h2 className={styles.nickname}>c0wsun</h2>
                <p> 등급 : 재미있는 활동가</p>
                <p> 팔로워 2 ・ 팔로잉 2 </p>

                <p className={styles.description}>
                    안녕하세요 여기는 내서재 페이지 입니다. <br />
                    프로필 편집 누르고 필명과 서재소개를 작성해 보세요. <br />
                    필명은 readio에서 보이는 나의 활동명이에요. 나를 나타내는 프로필 사진과 필명을 설정해 보세요.
                </p>
            </div>
        </div>
            <div className={styles.outProfileInfo}>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <strong>3</strong>
                        <span>포스트</span>
                    </div>
                    <div className={styles.statItem}>
                        <strong>5</strong>
                        <span>리뷰</span>
                    </div>
                    <div className={styles.statItem}>
                        <strong>3</strong>
                        <span>관심 영상</span>
                    </div>
                    <div className={styles.statItem}>
                        <strong>4</strong>
                        <span>관심 책</span>
                    </div>
                </div>


                <div className={styles.buttons}>
            <button className={styles.postBtn}>+ 포스트 작성하기</button>
            <button className={styles.interestBtn}>📌 나의 관심사</button>
        </div>
    </div>

            <hr className={styles.sectionDivider} />
</>


);
};
export default ProfileSection;