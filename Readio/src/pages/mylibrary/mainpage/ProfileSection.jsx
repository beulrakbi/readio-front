import React, { useEffect, useState } from 'react';
import styles from './MyLibrary.module.css';
import defaultImg from '../../../assets/defaultImg.png';
import pencilIcon from '../../../assets/pencil.png';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ProfileSection = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        penName: '',
        biography: '',
        imageUrl: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/user/profile/test2'); // 실제 유저 ID로 변경
                setProfile(res.data);
            } catch (err) {
                console.error('프로필 조회 실패:', err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className={styles.profileSectionWrapper}>
            <div className={styles.profileCard} onClick={() => navigate('/mylibrary/profile')} style={{ cursor: 'pointer' }}>
                <div className={styles.profileImageWrapper}>
                    <img src={profile.imageUrl ? `http://localhost:8080${profile.imageUrl}` : defaultImg} className={styles.profileImage} />
                    <img src={pencilIcon} className={styles.editIcon} alt="편집" />
                </div>

                <div className={styles.profileInfo}>
                    <h2 className={styles.nickname}>{profile.penName || 'Readio 기본 필명'}</h2>
                    <p>등급 : 재미있는 활동가</p>
                    <p>팔로워 2 ・ 팔로잉 2</p>
                </div>

                <p className={styles.description}>
                    {profile.biography ? profile.biography : (
                        <>
                            안녕하세요 여기는 내서재 페이지 입니다.<br />
                            프로필 편집 누르고 필명과 서재소개를 작성해 보세요.<br />
                            필명은 readio에서 보이는 나의 활동명이에요. 나를 나타내는 프로필 사진과 필명을 설정해 보세요.
                        </>
                    )}
                </p>
            </div>

            <div className={styles.outProfileInfo}>
                <div className={styles.stats}>
                    <div className={styles.statItem}><strong>3</strong><span>포스트</span></div>
                    <div className={styles.statItem}><strong>5</strong><span>리뷰</span></div>
                    <div className={styles.statItem}><strong>3</strong><span>관심 영상</span></div>
                    <div className={styles.statItem}><strong>4</strong><span>관심 책</span></div>
                </div>

                <div className={styles.buttons}>
                    <button className={styles.postBtn}>+ 포스트 작성하기</button>
                    <button className={styles.interestBtn} onClick={() => navigate('/mylibrary/interest')}>
                        📌 나의 관심사
                    </button>
                </div>
            </div>

            <hr className={styles.sectionDivider} />
        </div>
    );
};

export default ProfileSection;
