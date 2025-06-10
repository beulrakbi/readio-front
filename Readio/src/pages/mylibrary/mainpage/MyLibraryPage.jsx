import React, { useState, useEffect } from 'react';
import styles from './MyLibrary.module.css';
import ProfileSection from './ProfileSection.jsx';
import BookmarkSection from "./BookmarkSection.jsx";
import CalendarSection from "./CalendarSection.jsx";
import axios from "axios";
import {useLocation} from "react-router-dom";

const MyLibraryPage = () => {
    const [isOwner, setIsOwner] = useState(true);
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        const currentUserId = sessionStorage.getItem("userId");
        const urlUserId = window.location.pathname.split("/").pop();
        const targetUserId = urlUserId === "mylibrary" ? currentUserId : urlUserId;

        setIsOwner(currentUserId === targetUserId);

        const token = sessionStorage.getItem("accessToken");
        axios.get(`/api/user/profile/${targetUserId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            setIsPublic(res.data.isPrivate === 'PUBLIC');
        }).catch(err => {
            console.error("서재 공개 여부 조회 실패", err);
        });
    }, []);



    return (
        <div className={styles.profileSectionWrapper}>
            <ProfileSection />
            {isOwner || isPublic ? <BookmarkSection /> : null}
            <CalendarSection />
        </div>
    );
};

export default MyLibraryPage;
