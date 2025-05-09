import ProfileSection from '../../components/mylibrary/ProfileSection';
import BookmarkSection from "../../components/mylibrary/BookmarkSection.jsx";
import CalendarSection from "../../components/mylibrary/CalendarSection.jsx";
import ReportSection from "../../components/mylibrary/ReportSection.jsx"
const MyLibraryPage = () => {
    return (
        <div>
            <ProfileSection />
            <BookmarkSection />
            <CalendarSection />
            <ReportSection />
        </div>
    );
};

export default MyLibraryPage;
