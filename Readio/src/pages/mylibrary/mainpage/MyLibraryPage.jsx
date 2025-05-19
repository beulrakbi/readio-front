import styles from './MyLibrary.module.css';
import ProfileSection from './ProfileSection.jsx';
import BookmarkSection from "./BookmarkSection.jsx";
import CalendarSection from "./CalendarSection.jsx";
import ReportSection from "./ReportSection.jsx";

const MyLibraryPage = () => {
    return (
        <div className={styles.profileSectionWrapper}> {/* 여기에 클래스 적용 */}
            <ProfileSection />
            <BookmarkSection />
            <CalendarSection />
            <ReportSection />
        </div>
    );
};

export default MyLibraryPage;